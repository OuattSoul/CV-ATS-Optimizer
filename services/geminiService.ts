
import { GoogleGenAI, Type } from "@google/genai";
import { OptimizationResult } from "../types";

export const optimizeCV = async (cvText: string, jobDescription: string): Promise<OptimizationResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });
  
  const systemInstruction = `Tu es un expert senior en recrutement international et optimisation ATS.
Ta mission est de transformer un CV pour qu'il corresponde précisément à une offre d'emploi.

RÈGLES CRITIQUES :
1. Ne JAMAIS inventer d'expériences.
2. Utiliser des mots-clés exacts de l'offre.
3. Prioriser la lisibilité machine (ATS). Pas de tableaux, pas d'emojis, structure simple.
4. Être critique et direct dans l'audit.
5. Utiliser des verbes d'action forts et ajouter des métriques réalistes si suggérées.
6. Évalue la compatibilité actuelle du CV avec l'offre (atsScore entre 0 et 100).

Tu dois renvoyer une réponse exclusivement au format JSON respectant le schéma fourni.`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      atsScore: { type: Type.NUMBER, description: "Score global de compatibilité ATS du CV original par rapport à l'offre (0-100)" },
      atsAnalysis: {
        type: Type.OBJECT,
        properties: {
          keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
          priorities: { type: Type.ARRAY, items: { type: Type.STRING } },
          experienceLevel: { type: Type.STRING }
        },
        required: ["keywords", "technologies", "priorities", "experienceLevel"]
      },
      cvAudit: {
        type: Type.OBJECT,
        properties: {
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          inconsistencies: { type: Type.ARRAY, items: { type: Type.STRING } },
          missingMetrics: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["strengths", "weaknesses", "inconsistencies", "missingMetrics"]
      },
      recommendations: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          strategicPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          bulletPointTips: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "strategicPoints", "bulletPointTips"]
      },
      advancedTips: { type: Type.ARRAY, items: { type: Type.STRING } },
      finalCV: {
        type: Type.OBJECT,
        properties: {
          optimizedTitle: { type: Type.STRING },
          professionalSummary: { type: Type.STRING },
          keySkills: { type: Type.ARRAY, items: { type: Type.STRING } },
          professionalExperience: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                company: { type: Type.STRING },
                role: { type: Type.STRING },
                period: { type: Type.STRING },
                bullets: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["company", "role", "period", "bullets"]
            }
          },
          projects: { type: Type.ARRAY, items: { type: Type.STRING } },
          education: { type: Type.ARRAY, items: { type: Type.STRING } },
          toolsAndTech: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["optimizedTitle", "professionalSummary", "keySkills", "professionalExperience", "education", "toolsAndTech"]
      }
    },
    required: ["atsScore", "atsAnalysis", "cvAudit", "recommendations", "advancedTips", "finalCV"]
  };

  const isUrl = jobDescription.trim().startsWith('http');
  const jdPrompt = isUrl 
    ? `Utilise l'outil Google Search pour lire et analyser l'offre d'emploi à l'URL suivante : ${jobDescription.trim()}. Si tu ne peux pas y accéder, fais au mieux avec les informations publiques disponibles.`
    : `Voici l'offre d'emploi ciblée :\n---\n${jobDescription}\n---`;

  const prompt = `Voici le CV actuel de l'utilisateur :
---
${cvText}
---

${jdPrompt}

Analyse les deux et produis l'optimisation complète demandée.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema,
      temperature: 0.2,
      tools: isUrl ? [{ googleSearch: {} }] : [],
    },
  });

  return JSON.parse(response.text);
};
