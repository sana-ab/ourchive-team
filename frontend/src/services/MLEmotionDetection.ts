import * as tf from '@tensorflow/tfjs';

export type EmotionType = 'Calm' | 'Excited' | 'Stressed' | 'Aroused';

export interface BiometricData {
  heartRate: number;
  heartRateVariability: number; // HRV in ms
  movement: number; // 0-100 scale
  timeOfDay: number; // 0-23 hours
}

export interface EmotionPrediction {
  emotion: EmotionType;
  confidence: number;
  intensity: number;
}

// REAL Neural Network Model
let model: tf.Sequential | null = null;

// Training data - synthetic but realistic biometric patterns
const TRAINING_DATA = {
  // Format: [heartRate, HRV, movement, hourOfDay]
  inputs: [
    // Calm samples (low HR, high HRV, low movement)
    [65, 70, 10, 22], [68, 65, 5, 23], [70, 68, 12, 21],
    [62, 75, 8, 20], [67, 72, 6, 22], [69, 69, 11, 23],
    
    // Excited samples (high HR, low HRV, low-moderate movement)
    [95, 30, 25, 14], [98, 28, 30, 15], [92, 32, 20, 16],
    [100, 25, 28, 13], [97, 29, 22, 14], [93, 31, 26, 15],
    
    // Stressed samples (very high HR, very low HRV, moderate movement)
    [110, 20, 45, 9], [108, 22, 50, 10], [112, 18, 48, 11],
    [115, 19, 42, 8], [109, 21, 46, 9], [111, 20, 44, 10],
    
    // Aroused samples (high HR, moderate HRV, high movement)
    [88, 45, 80, 18], [90, 42, 85, 17], [87, 48, 78, 19],
    [92, 44, 82, 16], [89, 46, 84, 18], [91, 43, 79, 17],
  ],
  // One-hot encoded outputs: [Calm, Excited, Stressed, Aroused]
  outputs: [
    // Calm
    [1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0],
    [1, 0, 0, 0], [1, 0, 0, 0], [1, 0, 0, 0],
    // Excited
    [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0],
    [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0],
    // Stressed
    [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0],
    [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0],
    // Aroused
    [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1],
    [0, 0, 0, 1], [0, 0, 0, 1], [0, 0, 0, 1],
  ],
};

// Create and train the neural network
export async function initializeModel(): Promise<void> {
  console.log('🧠 Initializing ML emotion detection model...');
  
  // Create neural network architecture
  model = tf.sequential({
    layers: [
      tf.layers.dense({ 
        inputShape: [4], // [HR, HRV, movement, time]
        units: 16, 
        activation: 'relu',
        kernelInitializer: 'heNormal'
      }),
      tf.layers.dropout({ rate: 0.2 }),
      tf.layers.dense({ 
        units: 8, 
        activation: 'relu' 
      }),
      tf.layers.dense({ 
        units: 4, // 4 emotions
        activation: 'softmax' 
      }),
    ],
  });

  // Compile model
  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  // Prepare training data
  const xs = tf.tensor2d(TRAINING_DATA.inputs);
  const ys = tf.tensor2d(TRAINING_DATA.outputs);

  // Train the model
  console.log('🏋️ Training model on biometric data...');
  await model.fit(xs, ys, {
    epochs: 100,
    batchSize: 4,
    shuffle: true,
    verbose: 0, // Set to 1 to see training progress
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if (epoch % 20 === 0) {
          console.log(`Epoch ${epoch}: loss = ${logs?.loss.toFixed(4)}, accuracy = ${logs?.acc.toFixed(4)}`);
        }
      }
    }
  });

  console.log('✅ Model trained successfully!');
  
  // Clean up tensors
  xs.dispose();
  ys.dispose();
}

// Predict emotion from biometric data using REAL neural network
export async function predictEmotion(biometrics: BiometricData): Promise<EmotionPrediction> {
  if (!model) {
    throw new Error('Model not initialized. Call initializeModel() first.');
  }

  // Prepare input tensor
  const input = tf.tensor2d([[
    biometrics.heartRate,
    biometrics.heartRateVariability,
    biometrics.movement,
    biometrics.timeOfDay,
  ]]);

  // Get prediction
  const prediction = model.predict(input) as tf.Tensor;
  const probabilities = await prediction.data();

  // Clean up
  input.dispose();
  prediction.dispose();

  // Map to emotions
  const emotions: EmotionType[] = ['Calm', 'Excited', 'Stressed', 'Aroused']
  const probabilitiesArray = Array.from(probabilities);
  const maxIndex = probabilitiesArray.indexOf(Math.max(...probabilitiesArray));
  const emotion = emotions[maxIndex];
  const confidence = probabilities[maxIndex];

  // Calculate intensity based on HR deviation
  const baselineHR = 70;
  const intensity = Math.min(100, Math.abs(biometrics.heartRate - baselineHR) * 2);

  return {
    emotion,
    confidence: Math.round(confidence * 100) / 100,
    intensity: Math.round(intensity),
  };
}

// Simulate realistic biometric data (simulating Apple Watch)
export function getSimulatedBiometrics(): BiometricData {
  const now = new Date();
  const hour = now.getHours();
  
  // Circadian rhythm - HR higher during day
  const circadianEffect = Math.sin((hour - 6) / 12 * Math.PI) * 10;
  
  // Random variation
  const randomness = (Math.random() - 0.5) * 15;
  
  // Base heart rate with variations
  const heartRate = Math.max(60, Math.min(120, 70 + circadianEffect + randomness));
  
  // HRV inversely related to HR (stressed = high HR, low HRV)
  const heartRateVariability = Math.max(20, Math.min(80, 100 - heartRate));
  
  // Random movement
  const movement = Math.random() * 100;
  
  return {
    heartRate: Math.round(heartRate),
    heartRateVariability: Math.round(heartRateVariability),
    movement: Math.round(movement),
    timeOfDay: hour,
  };
}

// Detect if biometrics suggest an emotional moment
export function isEmotionalMoment(biometrics: BiometricData): boolean {
  const { heartRate, heartRateVariability } = biometrics;
  
  // Emotional = HR spike OR HRV drop
  const highHR = heartRate > 90;
  const lowHRV = heartRateVariability < 35;
  
  return highHR || lowHRV;
}

// Create heart rate stream for live monitoring
export function createBiometricStream(
  callback: (biometrics: BiometricData) => void,
  intervalMs: number = 2000
): () => void {
  const interval = setInterval(() => {
    const biometrics = getSimulatedBiometrics();
    callback(biometrics);
  }, intervalMs);
  
  return () => clearInterval(interval);
}