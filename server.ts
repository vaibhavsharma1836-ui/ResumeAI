import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const PORT = 3000;
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Helper to get Gemini client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Job Match Engine Analysis Endpoint (Pre-Optimization Deep Comparison)
app.post('/api/match-analysis', async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || typeof resumeText !== 'string' || !resumeText.trim()) {
      return res.status(400).json({ error: 'Resume text is required.' });
    }

    if (!jobDescription || typeof jobDescription !== 'string' || !jobDescription.trim()) {
      return res.status(400).json({ error: 'Job description is required.' });
    }

    if (resumeText.trim().length < 30) {
      return res.status(400).json({ error: 'The provided resume is too short. Please provide a more complete resume.' });
    }

    if (jobDescription.trim().length < 20) {
      return res.status(400).json({ error: 'The job description is too short. Please provide a more detailed job posting.' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a world-class Hiring Manager, Principal Recruiter, and ATS Job Match Analytics Engine.
Your mission is to perform an exhaustive, truth-anchored comparison between a candidate's ORIGINAL resume and a target JOB DESCRIPTION prior to optimization.

CRITICAL FACTUAL INTEGRITY MANDATES:
1. NEVER INVENT: You are strictly forbidden from claiming a candidate has skills, experiences, certifications, or education not explicitly supported by their original resume text.
2. ACCURATE SCORING: Calculate realistic scores (0-100) based on factual evidence, not random numbers or generic praise.
3. SKILLS MATCH:
   - 'matched': Concrete skills explicitly supported by the resume that directly meet the job description requirements.
   - 'missing': Important technical or domain skills required in the job description that have zero demonstrated evidence in the resume.
   - 'potential': Skills mentioned in the job description where the candidate shows adjacent, related, or partial experience, but hasn't clearly stated or emphasized it. Never tell the user to falsely claim skills they lack.
4. KEYWORD ANALYSIS:
   - Analyze important technical terms, industry terminology, tools, and methodologies from the job description. Ignore fluff/meaningless filler words.
   - 'matched': Target keywords present in the resume.
   - 'missing': Critical target keywords absent from the resume.
   - 'semantic': Semantic matches where the job description uses one term and the resume uses an equivalent or directly transferable term (provide { jobTerm, resumeEquivalent, notes }).
5. EXPERIENCE ALIGNMENT:
   - 'strongMatches': Core responsibilities in the job description where the resume provides strong, direct evidence.
   - 'partialMatches': Areas where the candidate has partial background or related exposure but with scope/scale gaps.
   - 'insufficientEvidence': Explicit role requirements where the resume provides insufficient or no proof. Do NOT invent experience.
6. EDUCATION & CERTIFICATIONS:
   - Compare required vs actual candidate credentials. Distinguish 'matched', 'missing', and 'notMentioned'. Never recommend fabricating degrees or certifications.
7. RESUME STRENGTHS:
   - 3 to 6 specific, tangible highlights of why this candidate's genuine background stands out for this particular role.
8. RESUME GAPS:
   - 3 to 5 clear, unembellished gaps or missing evidence areas (without phrasing missing qualifications as if the user actually has them).
9. ACTION PLAN ("How to improve your match"):
   - 4 to 6 highly practical, ethical, truth-grounded recommendations (e.g. rephrasing a bullet point to highlight an authentic accomplishment, bringing a relevant tool higher in the skills list, clarifying scope of a genuine project, or emphasizing existing transferable skills). Never recommend fabricating information.
10. BREAKDOWN SCORES:
   - breakdown.overall: 0-100 realistic overall match percentage
   - breakdown.skills: 0-100 skills alignment percentage
   - breakdown.experience: 0-100 experience alignment percentage
   - breakdown.keywords: 0-100 keyword match percentage
   - breakdown.education: 0-100 education/certifications alignment percentage
   - tier: e.g. "High Alignment (80-100%)", "Competitive Fit (65-79%)", "Moderate Match (50-64%)", or "Substantial Gaps (<50%)"
   - summaryVerdict: A 2-sentence executive summary of the match fit.`;

    const userPrompt = `TARGET JOB DESCRIPTION:
${jobDescription.trim()}

---

ORIGINAL CANDIDATE RESUME:
${resumeText.trim()}

Please perform the complete Job Match Analysis comparing the candidate's authentic resume against the job description.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.15, // Very low temperature for analytical precision
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER, description: 'Overall job match score from 0 to 100 based on rigorous comparison.' },
            tier: { type: Type.STRING, description: 'Tier label e.g. High Alignment, Competitive Fit, Moderate Match, Substantial Gaps' },
            summaryVerdict: { type: Type.STRING, description: '2-sentence concise summary verdict of candidate fit.' },
            breakdown: {
              type: Type.OBJECT,
              properties: {
                overall: { type: Type.NUMBER, description: 'Overall match score 0-100' },
                skills: { type: Type.NUMBER, description: 'Skills match score 0-100' },
                experience: { type: Type.NUMBER, description: 'Experience alignment score 0-100' },
                keywords: { type: Type.NUMBER, description: 'Keywords alignment score 0-100' },
                education: { type: Type.NUMBER, description: 'Education & certs alignment score 0-100' },
              },
              required: ['overall', 'skills', 'experience', 'keywords', 'education'],
            },
            skillsMatch: {
              type: Type.OBJECT,
              properties: {
                matched: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Skills genuinely supported by resume.' },
                missing: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Important JD skills not found in resume.' },
                potential: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Adjacent or partially demonstrated skills.' },
              },
              required: ['matched', 'missing', 'potential'],
            },
            keywordAnalysis: {
              type: Type.OBJECT,
              properties: {
                matched: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Target terms present in resume.' },
                missing: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Target terms absent from resume.' },
                semantic: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      jobTerm: { type: Type.STRING },
                      resumeEquivalent: { type: Type.STRING },
                      notes: { type: Type.STRING },
                    },
                    required: ['jobTerm', 'resumeEquivalent'],
                  },
                  description: 'Related / semantic matches between JD and resume.',
                },
              },
              required: ['matched', 'missing', 'semantic'],
            },
            experienceAlignment: {
              type: Type.OBJECT,
              properties: {
                strongMatches: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      area: { type: Type.STRING },
                      evidence: { type: Type.STRING },
                    },
                    required: ['area', 'evidence'],
                  },
                },
                partialMatches: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      area: { type: Type.STRING },
                      candidateBackground: { type: Type.STRING },
                      gap: { type: Type.STRING },
                    },
                    required: ['area', 'candidateBackground', 'gap'],
                  },
                },
                insufficientEvidence: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      requirement: { type: Type.STRING },
                      note: { type: Type.STRING },
                    },
                    required: ['requirement', 'note'],
                  },
                },
              },
              required: ['strongMatches', 'partialMatches', 'insufficientEvidence'],
            },
            educationAndCerts: {
              type: Type.OBJECT,
              properties: {
                matched: { type: Type.ARRAY, items: { type: Type.STRING } },
                missing: { type: Type.ARRAY, items: { type: Type.STRING } },
                notMentioned: { type: Type.ARRAY, items: { type: Type.STRING } },
                analysis: { type: Type.STRING },
              },
              required: ['matched', 'missing', 'notMentioned', 'analysis'],
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Top candidate strengths for this role.',
            },
            gaps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Key areas of missing evidence or gaps.',
            },
            actionPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, description: 'bullet, skill, project, section, or general' },
                  title: { type: Type.STRING },
                  recommendation: { type: Type.STRING },
                  exampleOrTip: { type: Type.STRING },
                },
                required: ['category', 'title', 'recommendation'],
              },
              description: 'Truth-grounded practical steps to improve match.',
            },
          },
          required: [
            'overallScore',
            'tier',
            'summaryVerdict',
            'breakdown',
            'skillsMatch',
            'keywordAnalysis',
            'experienceAlignment',
            'educationAndCerts',
            'strengths',
            'gaps',
            'actionPlan',
          ],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('No response received from the Job Match Engine.');
    }

    const parsedData = JSON.parse(responseText);
    parsedData.analyzedAt = new Date().toISOString();

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error during job match analysis:', error);
    let userMessage = 'Unable to complete job match analysis. Please check your inputs and try again.';
    if (error?.message && !error.message.includes('key')) {
      userMessage = error.message;
    }
    return res.status(500).json({
      success: false,
      error: userMessage,
    });
  }
});

// Resume Optimization Endpoint
app.post('/api/optimize', async (req, res) => {
  try {
    const { resumeText, jobDescription, customizationOptions, matchAnalysis } = req.body;

    if (!resumeText || typeof resumeText !== 'string' || !resumeText.trim()) {
      return res.status(400).json({ error: 'Resume text is required.' });
    }

    if (!jobDescription || typeof jobDescription !== 'string' || !jobDescription.trim()) {
      return res.status(400).json({ error: 'Job description is required.' });
    }

    if (resumeText.trim().length < 30) {
      return res.status(400).json({ error: 'The provided resume is too short. Please provide a more complete resume.' });
    }

    if (jobDescription.trim().length < 20) {
      return res.status(400).json({ error: 'The job description is too short. Please provide a more detailed job posting.' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a world-class ATS-compliant Executive Resume Optimizer and Career Strategist.
Your mission is to take a candidate's existing resume and a target job description, then rewrite and optimize the resume to maximize alignment with the job description while following strict truthfulness rules.

CRITICAL SAFETY, ACCURACY, AND TRUTHFULNESS MANDATES:
1. NEVER INVENT: You are strictly forbidden from inventing jobs, companies, employment dates, degrees, institutions, certifications, metrics, or skills that are NOT supported by the original resume.
2. STRICT GROUNDING: Every bullet point and capability must be directly grounded in real experiences stated in the candidate's original resume.
3. PERMITTED ENHANCEMENTS: You MAY:
   - Rephrase bullet points using powerful action verbs (e.g., "Spearheaded", "Architected", "Engineered", "Orchestrated", "Accelerated", "Streamlined").
   - Restructure bullet points for clarity, impact, and standard ATS readability (e.g. Action Verb + Context + Result).
   - Reorder or emphasize existing skills and experiences that directly match the target job description.
   - Adjust the Professional Summary / Profile to tailor it directly to the target role using the candidate's verified background.
   - Align terminology and keywords from the job description when describing genuine tasks the candidate performed.
4. RESUME FORMATTING:
   - The 'optimizedResume' field must contain ONLY the complete, ready-to-use resume in clean, standard Markdown.
   - Use clear markdown headers (# for Candidate Name, ## for Sections like Professional Summary, Experience, Skills, Education, Projects).
   - Use standard bullet lists (- ) for achievements.
   - Do NOT include conversational preambles, meta-commentary, notes, or optimization explanations inside 'optimizedResume'.
5. OPTIMIZATION SUMMARY:
   - Provide a separate, rich structured summary object detailing:
     - 'keywordsIdentified': Critical skills, technologies, and requirements extracted from the target job description.
     - 'skillsEmphasized': Real skills from the candidate's resume that were brought forward to match the JD.
     - 'sectionsImproved': Detailed breakdown of what was refined in each section.
     - 'matchScoreEstimate': An estimated ATS/JD alignment score from 1 to 100 based on keyword overlap and experience match.
     - 'keyHighlights': 3 to 5 concise bullet points summarizing high-impact improvements.`;

    let matchContextPrompt = '';
    if (matchAnalysis) {
      matchContextPrompt = `
PRE-OPTIMIZATION JOB MATCH ANALYSIS CONTEXT:
- Initial Overall Match Score: ${matchAnalysis.overallScore || 'N/A'}/100
- Matched Skills to Prioritize: ${(matchAnalysis.skillsMatch?.matched || []).slice(0, 10).join(', ')}
- Semantic Equivalents to Bridge: ${(matchAnalysis.keywordAnalysis?.semantic || []).map((s: any) => `${s.resumeEquivalent} -> ${s.jobTerm}`).join('; ')}
- Key Strengths to Highlight: ${(matchAnalysis.strengths || []).slice(0, 4).join('; ')}
Please use this diagnostic context to strategically bridge terminology and emphasize genuine achievements without fabricating any qualifications.`;
    }

    const userPrompt = `TARGET JOB DESCRIPTION:
${jobDescription.trim()}

---

ORIGINAL CANDIDATE RESUME:
${resumeText.trim()}
${matchContextPrompt}

${customizationOptions?.tone ? `Target Tone: ${customizationOptions.tone}` : ''}
${customizationOptions?.emphasis ? `Focus Emphasis: ${customizationOptions.emphasis}` : ''}

Please analyze the job description, extract key requirements, evaluate the candidate's actual qualifications, and produce the optimized resume and detailed optimization breakdown.`;


    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.2, // Low temperature for high factual precision
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizedResume: {
              type: Type.STRING,
              description: 'The complete rewritten and optimized resume in clean, standard Markdown only. No greetings or meta-text.',
            },
            summary: {
              type: Type.OBJECT,
              properties: {
                matchScoreEstimate: {
                  type: Type.NUMBER,
                  description: 'Estimated alignment score (0-100) after optimization.',
                },
                keywordsIdentified: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Crucial keywords and requirements identified in the job description.',
                },
                skillsEmphasized: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Existing candidate skills that were highlighted and aligned.',
                },
                sectionsImproved: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      section: { type: Type.STRING, description: 'Name of the resume section (e.g. Professional Summary, Experience, Skills)' },
                      improvements: { type: Type.STRING, description: 'Summary of what specific enhancements were applied' },
                    },
                    required: ['section', 'improvements'],
                  },
                  description: 'List of improved resume sections with details.',
                },
                keyHighlights: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '3-4 key strategic improvements made to the resume.',
                },
              },
              required: ['matchScoreEstimate', 'keywordsIdentified', 'skillsEmphasized', 'sectionsImproved', 'keyHighlights'],
            },
          },
          required: ['optimizedResume', 'summary'],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('No response received from the AI optimization engine.');
    }

    let parsedData: any;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseErr) {
      console.error('Failed to parse model JSON:', responseText);
      throw new Error('Could not process the optimized resume format. Please retry.');
    }

    // Sanitize optimized resume output to guarantee clean markdown with zero conversational fluff
    if (parsedData?.optimizedResume && typeof parsedData.optimizedResume === 'string') {
      let cleanResume = parsedData.optimizedResume.trim();
      
      // Strip markdown code block wrapper if present
      if (cleanResume.startsWith('```markdown')) {
        cleanResume = cleanResume.replace(/^```markdown\s*/i, '').replace(/\s*```$/, '');
      } else if (cleanResume.startsWith('```md')) {
        cleanResume = cleanResume.replace(/^```md\s*/i, '').replace(/\s*```$/, '');
      } else if (cleanResume.startsWith('```')) {
        cleanResume = cleanResume.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // Strip common conversational preamble artifacts if any
      cleanResume = cleanResume.replace(/^(here is your (optimized|rewritten)?\s*resume:?|sure,? here is the resume:?|below is your optimized resume:?)\s*/i, '');

      parsedData.optimizedResume = cleanResume.trim();
    }

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error during resume optimization:', error);
    
    // User-friendly error message that never leaks API keys or internal stack traces
    let userMessage = 'Unable to optimize resume at this time. Please verify your inputs and try again.';
    const rawError = error?.message || '';

    if (rawError.includes('GEMINI_API_KEY')) {
      userMessage = 'API configuration error. Please ensure the GEMINI_API_KEY is properly set in the workspace settings.';
    } else if (rawError.includes('quota') || rawError.includes('RESOURCE_EXHAUSTED')) {
      userMessage = 'The AI service is temporarily experiencing high demand. Please wait a few seconds and try again.';
    } else if (rawError.includes('safety') || rawError.includes('blocked')) {
      userMessage = 'The text submitted could not be processed due to content safety filters. Please adjust the input text.';
    } else if (error?.message && !error.message.includes('key') && !error.message.includes('token')) {
      userMessage = error.message;
    }

    return res.status(500).json({
      success: false,
      error: userMessage,
    });
  }
});

// Resume Section AI Improvement Endpoint
app.post('/api/improve-section', async (req, res) => {
  try {
    const { sectionType, text, jobDescription, improvementType, context } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Text to improve is required.' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a world-class ATS-compliant Executive Resume Editor and Career Strategist.
Your task is to refine and improve a specific resume section or bullet point while adhering to strict factual accuracy.

CRITICAL SAFETY & TRUTHFULNESS MANDATES:
1. NEVER INVENT: You are strictly forbidden from inventing jobs, companies, dates, degrees, metrics, statistics, or skills not present in the input text or context.
2. PRESERVE FACTS: Retain the actual truth and essence of what the candidate did.
3. ENHANCE IMPACT: Apply the requested improvement strategy:
   - 'strengthen': Use powerful action verbs (e.g. Spearheaded, Engineered, Orchestrated, Optimized, Accelerated), clear cause-and-effect structure, and eliminate weak passive phrasing.
   - 'concise': Trim filler words, redundant adjectives, and fluff while keeping the core accomplishment crisp and impactful.
   - 'keywords': Incorporate relevant terminology and keywords from the target job description ONLY where it accurately represents what the candidate described.
   - 'grammar': Polish grammar, tense consistency, punctuation, and professional tone.
   - 'general': Deliver a polished, ATS-optimized version combining strong verbs and clarity.
4. OUTPUT:
   - Return ONLY the rewritten text (a single bullet, summary paragraph, or item).
   - Do NOT include conversational filler, quotes, greetings, or explanations.`;

    let instructionDetails = `Improvement Goal: ${improvementType || 'general'}`;
    if (jobDescription) {
      instructionDetails += `\nTarget Job Context: ${jobDescription.slice(0, 800)}`;
    }
    if (context) {
      instructionDetails += `\nCandidate Role/Context: ${context}`;
    }

    const userPrompt = `ORIGINAL TEXT TO IMPROVE (${sectionType || 'bullet'}):
"${text.trim()}"

${instructionDetails}

Please provide the refined, highly impactful version following all truthfulness rules:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    const refinedText = response.text ? response.text.trim().replace(/^["']|["']$/g, '').replace(/^-\s*/, '') : text;

    return res.json({
      success: true,
      improvedText: refinedText,
    });
  } catch (error: any) {
    console.error('Error during section improvement:', error);
    let userMessage = 'Unable to improve text at this time. Please try again.';
    if (error?.message && !error.message.includes('key')) {
      userMessage = error.message;
    }
    return res.status(500).json({
      success: false,
      error: userMessage,
    });
  }
});

// AI Cover Letter Generator Endpoint
app.post('/api/generate-cover-letter', async (req, res) => {
  try {
    const { candidateInfo, resumeSummary, experienceHighlights, skills, jobDescription, companyName, recipientName, tone } = req.body;

    if (!candidateInfo?.fullName) {
      return res.status(400).json({ error: 'Candidate name is required.' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a world-class Executive Career Strategist and Cover Letter Writer.
Your task is to write a compelling, authentic, high-impact Cover Letter tailored for a candidate applying to a target role.

CRITICAL TRUTHFULNESS & FACTUAL FIDELITY RULES:
1. Ground all claims strictly in the candidate's provided background, experience highlights, and genuine skills.
2. DO NOT invent previous companies, degrees, awards, or metrics.
3. Structure the cover letter professionally:
   - Salutation: Addressed to recipient or 'Hiring Team'
   - Opening: Engaging statement of intent, role applied for, and candidate's core value proposition.
   - Body Paragraph 1: Key relevant achievements & alignment with company mission / requirements.
   - Body Paragraph 2: Core technical/domain strengths, problem-solving capability, and why this candidate is a direct fit.
   - Closing: Call to action, expressing enthusiasm for an interview.
   - Signature: Professional sign-off.`;

    const userPrompt = `CANDIDATE INFORMATION:
Name: ${candidateInfo.fullName}
Title: ${candidateInfo.title || 'Professional'}
Email: ${candidateInfo.email || ''}
Location: ${candidateInfo.location || ''}

RESUME SUMMARY:
${resumeSummary || 'Not provided'}

EXPERIENCE HIGHLIGHTS:
${experienceHighlights || 'General background'}

KEY SKILLS:
${skills || 'General industry skills'}

TARGET ROLE & COMPANY:
Company: ${companyName || 'Target Organization'}
Recipient / Hiring Manager: ${recipientName || 'Hiring Manager'}
Tone: ${tone || 'professional, confident, and engaging'}

JOB DESCRIPTION:
${jobDescription || 'Standard requirements for the specified role.'}

Please generate the complete structured cover letter.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            salutation: { type: Type.STRING, description: 'e.g. Dear Hiring Manager, or Dear Mr. Smith,' },
            opening: { type: Type.STRING, description: 'Opening paragraph introducing candidate and interest in the role.' },
            bodyParagraphs: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2-3 impactful body paragraphs aligning experience with role requirements.'
            },
            closing: { type: Type.STRING, description: 'Closing paragraph with interview call-to-action.' },
            signature: { type: Type.STRING, description: 'Sign-off phrase, e.g. Sincerely, or Best regards,' }
          },
          required: ['salutation', 'opening', 'bodyParagraphs', 'closing', 'signature']
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('No response from AI cover letter generator.');
    }

    const parsedData = JSON.parse(responseText);

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error generating cover letter:', error);
    let userMessage = 'Unable to generate cover letter. Please try again.';
    if (error?.message && !error.message.includes('key')) {
      userMessage = error.message;
    }
    return res.status(500).json({
      success: false,
      error: userMessage,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ResumeAI server running on http://localhost:${PORT}`);
  });
}

startServer();
