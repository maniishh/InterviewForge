 'use strict';

const roadmapPromptBuilder = {
  buildRoadmapPrompt(analyticsData) {
    const { overview, topics, companies, breakdown } = analyticsData;

    const weakTopicsList = (topics?.weak || [])
      .map(t => `  - ${t.topic}: avg ${t.avgScore}/10 (${t.attempts} attempt${t.attempts !== 1 ? 's' : ''})`)
      .join('\n') || '  - None identified yet';

    const strongTopicsList = (topics?.strong || [])
      .map(t => `  - ${t.topic}: avg ${t.avgScore}/10 (${t.attempts} attempt${t.attempts !== 1 ? 's' : ''})`)
      .join('\n') || '  - None identified yet';

    const developingTopicsList = (topics?.developing || [])
      .map(t => `  - ${t.topic}: avg ${t.avgScore}/10`)
      .join('\n') || '  - None identified yet';

    const companiesList = (companies || [])
      .map(c => `  - ${c.company}: ${c.sessions} session${c.sessions !== 1 ? 's' : ''}, avg score ${c.avgScore}/10`)
      .join('\n') || '  - No target companies yet';

    const difficultyList = (breakdown || [])
      .map(d => `  - ${d.difficulty}: ${d.sessions} session${d.sessions !== 1 ? 's' : ''}, avg ${d.avgOverallScore}/10`)
      .join('\n') || '  - No difficulty data yet';

    const avgScore = overview?.avgOverallScore || 0;
    const experienceLevel =
      avgScore >= 8.0 ? 'senior (strong fundamentals, ready for system design depth)'
    : avgScore >= 6.5 ? 'mid-level (solid basics, needs depth on advanced topics)'
    : avgScore >= 5.0 ? 'junior-mid (fundamentals present, significant gaps to fill)'
    : 'entry-level (fundamentals need strengthening across the board)';

    const sessionCount = overview?.totalSessions || 0;
    const weeks = sessionCount >= 10 ? 8 : sessionCount >= 5 ? 6 : 4;

    const systemPrompt = `You are a senior software engineering interview coach with 10+ years of experience helping engineers land roles at top tech companies.

You have access to a candidate's complete interview performance data. Your task is to generate a personalised, actionable learning roadmap based on their actual performance — not a generic study plan.

CANDIDATE PERFORMANCE SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total interviews completed: ${sessionCount}
Overall average score: ${avgScore}/10
Technical accuracy avg: ${overview?.avgTechnicalScore || 0}/10
Communication avg: ${overview?.avgCommunicationScore || 0}/10
Depth avg: ${overview?.avgDepthScore || 0}/10
Assessed level: ${experienceLevel}

WEAK AREAS (score < 5.5 — highest priority):
${weakTopicsList}

DEVELOPING AREAS (score 5.5–6.9 — medium priority):
${developingTopicsList}

STRONG AREAS (score 7.0+ — maintain and deepen):
${strongTopicsList}

TARGET COMPANIES:
${companiesList}

DIFFICULTY PERFORMANCE:
${difficultyList}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ROADMAP REQUIREMENTS:
1. Generate exactly ${weeks} weeks of content
2. Each week must have a clear focus theme
3. Daily tasks should be realistic (1–2 hours per day max)
4. Resources must be SPECIFIC: exact LeetCode problem names/numbers, specific book chapters, exact YouTube video titles
5. Prioritise weak areas in early weeks, build up to strong areas later
6. Include mock interview practice starting from week 3
7. Each week must have a measurable success criterion
8. Communication and depth improvement should be woven throughout (not just technical skills)
9. The roadmap must reflect the ACTUAL weak topics — do not give generic advice

OUTPUT RULES:
- Return ONLY valid JSON, no markdown, no preamble, no explanation
- Every field in the schema must be present
- resource URLs should be real, specific resources (LeetCode, NeetCode, AlgoExpert, specific YouTube channels)
- difficulty in dailyTasks: "easy" | "medium" | "hard"
- category: "technical" | "behavioral" | "system-design" | "practice"

JSON SCHEMA (return exactly this structure):
{
  "title": "string — personalised roadmap title mentioning their goal",
  "summary": "string — 2-3 sentence personalised overview of their situation and what this roadmap addresses",
  "targetScore": number (0-10, realistic goal based on current performance),
  "estimatedWeeks": ${weeks},
  "phases": [
    {
      "phase": number (1-based),
      "title": "string — phase name",
      "weekRange": "string e.g. Weeks 1-2",
      "focus": "string — what this phase targets",
      "weeks": [
        {
          "week": number,
          "theme": "string — this week's specific focus",
          "goal": "string — measurable success criterion for this week",
          "dailyTasks": [
            {
              "day": "string e.g. Monday",
              "task": "string — specific task",
              "duration": "string e.g. 90 minutes",
              "category": "technical | behavioral | system-design | practice",
              "difficulty": "easy | medium | hard",
              "resource": "string — specific resource with name (e.g. LeetCode #1 Two Sum, NeetCode Arrays playlist)"
            }
          ],
          "weeklyChallenge": "string — one harder challenge to attempt at week end",
          "successMetric": "string — how to know you've mastered this week"
        }
      ]
    }
  ],
  "keyResources": [
    {
      "name": "string — resource name",
      "type": "string — book | video | platform | course",
      "url": "string — real URL",
      "priority": "string — must-have | recommended | optional",
      "reason": "string — why this specific resource for this candidate"
    }
  ],
  "behavioralPlan": {
    "focus": "string — specific behavioral areas to improve",
    "starStories": number,
    "practiceFrequency": "string — how often to practice",
    "topics": ["string array of behavioral topics to prepare"]
  },
  "mockInterviewSchedule": {
    "startingWeek": number,
    "frequency": "string",
    "focus": "string"
  }
}`;

    const userPrompt = `Generate a ${weeks}-week personalised interview preparation roadmap for this candidate. Focus especially on their weak areas: ${(topics?.weak || []).map(t => t.topic).join(', ') || 'general fundamentals'}. Return only the JSON roadmap.`;

    return [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];
  },
};

module.exports = roadmapPromptBuilder;