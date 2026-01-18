import { NextResponse } from 'next/server';

// You can configure this email address
const RECIPIENT_EMAIL = process.env.STORY_RECIPIENT_EMAIL || 'your-email@example.com';

interface IntakeResponse {
  id: string;
  question: string;
  answer: string;
  category: string;
  answeredAt: Date;
}

const CATEGORY_TITLES: Record<string, string> = {
  basics: '📋 Basic Information',
  situation: '🏠 Current Situation',
  health: '🏥 Health & Medical',
  history: '📖 Life Story',
  falcons: '🏈 The Atlanta Falcons',
  goals: '🎯 Goals & Dreams',
};

function formatStoryAsEmail(responses: IntakeResponse[]): string {
  // Group by category
  const byCategory: Record<string, IntakeResponse[]> = {};
  responses.forEach(r => {
    if (!byCategory[r.category]) byCategory[r.category] = [];
    byCategory[r.category].push(r);
  });

  const categoryOrder = ['basics', 'situation', 'health', 'history', 'falcons', 'goals'];

  let emailBody = `
========================================
JENNIFER'S STORY
Submitted: ${new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}
========================================

`;

  for (const category of categoryOrder) {
    const categoryResponses = byCategory[category];
    if (!categoryResponses?.length) continue;

    emailBody += `\n${CATEGORY_TITLES[category] || category.toUpperCase()}\n`;
    emailBody += '─'.repeat(40) + '\n\n';

    for (const response of categoryResponses) {
      emailBody += `Q: ${response.question}\n`;
      emailBody += `A: ${response.answer}\n\n`;
    }
  }

  emailBody += `
========================================
FALCONS LETTER DRAFT
========================================

Dear Atlanta Falcons Organization,

I'm writing to share the story of Jennifer, a lifelong Falcons fan who is going through an incredibly difficult time. Despite facing homelessness and the loss of her leg, her love for the Falcons remains one of her greatest sources of hope and joy.

${byCategory['falcons']?.map(r => r.answer).join('\n\n') || ''}

Jennifer's situation:
${byCategory['situation']?.map(r => `• ${r.answer}`).join('\n') || ''}

What would help Jennifer most:
${responses.find(r => r.id === 'falcons_dream')?.answer || 'Any support would mean the world to her.'}

Jennifer is a true fan who represents the heart and spirit of Falcons Nation. Any gesture of support—whether it's a signed jersey, tickets to a game, or simply a message of encouragement—would mean the world to her.

Rise Up!

========================================
NEXT STEPS FOR FAMILY
========================================

1. Review Jennifer's responses above
2. Use the Falcons letter draft to reach out to:
   - Atlanta Falcons Community Relations
   - Arthur Blank Family Foundation
   - Local Atlanta sports media

3. Key action items for Jennifer:
   - Get SOAR worker (call 211)
   - Apply for Presumptive SSI (she qualifies due to amputation)
   - Get Grady Card for free medical care
   - Apply for SNAP (expedited due to homeless status)

4. Contact information:
   - Atlanta Falcons: (470) 341-4500
   - Falcons Community: community@atlantafalcons.com

========================================
`;

  return emailBody;
}

function formatStoryAsHTML(responses: IntakeResponse[]): string {
  // Group by category
  const byCategory: Record<string, IntakeResponse[]> = {};
  responses.forEach(r => {
    if (!byCategory[r.category]) byCategory[r.category] = [];
    byCategory[r.category].push(r);
  });

  const categoryOrder = ['basics', 'situation', 'health', 'history', 'falcons', 'goals'];

  let html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Georgia, serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
    .header { background: #A71930; color: white; padding: 30px; text-align: center; border-radius: 10px; margin-bottom: 30px; }
    .header h1 { margin: 0; font-size: 28px; }
    .header p { margin: 10px 0 0; opacity: 0.9; }
    .section { background: white; padding: 25px; margin-bottom: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .section h2 { color: #A71930; margin-top: 0; border-bottom: 2px solid #A71930; padding-bottom: 10px; }
    .qa { margin-bottom: 20px; }
    .qa .question { font-weight: bold; color: #333; margin-bottom: 5px; }
    .qa .answer { color: #555; line-height: 1.6; padding-left: 15px; border-left: 3px solid #A71930; }
    .letter { background: #fffef0; border: 2px solid #C19A6B; }
    .next-steps { background: #f0fff0; border: 2px solid #2d6a4f; }
    .next-steps h2 { color: #2d6a4f; border-color: #2d6a4f; }
    .next-steps ul { line-height: 1.8; }
    .footer { text-align: center; color: #888; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏈 Jennifer's Story</h1>
    <p>Submitted ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
  </div>
`;

  for (const category of categoryOrder) {
    const categoryResponses = byCategory[category];
    if (!categoryResponses?.length) continue;

    html += `
  <div class="section">
    <h2>${CATEGORY_TITLES[category] || category}</h2>
`;
    for (const response of categoryResponses) {
      html += `
    <div class="qa">
      <div class="question">${response.question}</div>
      <div class="answer">${response.answer.replace(/\n/g, '<br>')}</div>
    </div>
`;
    }
    html += `  </div>`;
  }

  html += `
  <div class="section letter">
    <h2>📝 Draft Letter to Atlanta Falcons</h2>
    <p>Dear Atlanta Falcons Organization,</p>
    <p>I'm writing to share the story of Jennifer, a lifelong Falcons fan who is going through an incredibly difficult time. Despite facing homelessness and the loss of her leg, her love for the Falcons remains one of her greatest sources of hope and joy.</p>
    <p><strong>What the Falcons mean to Jennifer:</strong><br>
    ${byCategory['falcons']?.map(r => r.answer).join('<br><br>') || ''}</p>
    <p><strong>What would help most:</strong><br>
    ${responses.find(r => r.id === 'falcons_dream')?.answer || 'Any support would mean the world to her.'}</p>
    <p>Rise Up!</p>
  </div>

  <div class="section next-steps">
    <h2>✅ Next Steps</h2>
    <ul>
      <li><strong>SOAR Worker:</strong> Call 211 to get connected with a SOAR specialist who can help with SSI</li>
      <li><strong>Presumptive SSI:</strong> Jennifer qualifies for immediate payments due to her amputation</li>
      <li><strong>Grady Card:</strong> Call 404-616-1000 for free medical care</li>
      <li><strong>SNAP:</strong> Apply at gateway.ga.gov for expedited food assistance</li>
    </ul>
    <p><strong>Falcons Contacts:</strong></p>
    <ul>
      <li>Atlanta Falcons: (470) 341-4500</li>
      <li>Community Relations: community@atlantafalcons.com</li>
      <li>Arthur Blank Family Foundation</li>
    </ul>
  </div>

  <div class="footer">
    <p>Generated by Jennifer's Assistant</p>
  </div>
</body>
</html>
`;

  return html;
}

export async function POST(req: Request) {
  try {
    const { responses } = await req.json() as { responses: IntakeResponse[] };

    if (!responses || responses.length === 0) {
      return NextResponse.json({ error: 'No responses provided' }, { status: 400 });
    }

    const emailText = formatStoryAsEmail(responses);
    const emailHtml = formatStoryAsHTML(responses);

    // For now, we'll return the formatted content
    // In production, you'd integrate with an email service like SendGrid, Resend, etc.
    // Example with Resend:
    //
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'Jennifer\'s Assistant <noreply@yourdomain.com>',
    //   to: RECIPIENT_EMAIL,
    //   subject: '🏈 Jennifer\'s Story - Please Read',
    //   text: emailText,
    //   html: emailHtml,
    // });

    // For demo purposes, log the content and return success
    console.log('=== JENNIFER\'S STORY ===');
    console.log(emailText);
    console.log('========================');

    // Store in localStorage as backup (client will handle this)
    return NextResponse.json({
      success: true,
      message: 'Story compiled successfully',
      // Include the formatted content so it can be displayed/copied
      content: {
        text: emailText,
        html: emailHtml,
      }
    });

  } catch (error) {
    console.error('Error processing story:', error);
    return NextResponse.json({ error: 'Failed to process story' }, { status: 500 });
  }
}
