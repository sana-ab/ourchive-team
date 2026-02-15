import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface Memory {
  id: number;
  imageUrl?: string;
  emotion: string;
  intensity: number;
  timestamp: string;
  location: string;
  latitude?: number;
  longitude?: number;
  heartRate: number;
  privacy: 'Private' | 'Friends' | 'Public';
  createdAt?: string;
}

// GET all memories
export async function getAllMemories(): Promise<Memory[]> {
  try {
    const response = await axios.get(`${API_URL}/memories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching memories:', error);
    return [];
  }
}

// POST new memory
export async function createMemory(data: {
  emotion: string;
  intensity: number;
  timestamp: string;
  location: string;
  latitude?: number;
  longitude?: number;
  heartRate: number;
  privacy: string;
  image?: File;
}): Promise<Memory | null> {
  try {
    const formData = new FormData();
    
    if (data.image) {
      formData.append('image', data.image);
    }
    
    formData.append('emotion', data.emotion);
    formData.append('intensity', data.intensity.toString());
    formData.append('timestamp', data.timestamp);
    formData.append('location', data.location);
    formData.append('heartRate', data.heartRate.toString());
    formData.append('privacy', data.privacy);
    
    if (data.latitude) formData.append('latitude', data.latitude.toString());
    if (data.longitude) formData.append('longitude', data.longitude.toString());
    
    const response = await axios.post(`${API_URL}/memories`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating memory:', error);
    return null;
  }
}

// DELETE memory
export async function deleteMemory(id: number): Promise<boolean> {
  try {
    await axios.delete(`${API_URL}/memories/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting memory:', error);
    return false;
  }
}

// GET stats
export async function getStats() {
  try {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
}
