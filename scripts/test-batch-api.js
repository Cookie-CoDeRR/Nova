const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: 'test' });
console.log('models methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(ai.models)));
