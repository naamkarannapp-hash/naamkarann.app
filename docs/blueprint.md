# **App Name**: Naamkarann

## Core Features:

- Input Criteria: Allow users to input criteria for name generation including gender, regional roots, starting letters, parent's name blend, sibling name matching, inspirations, and tradition.
- Data Submission: Send a POST request to the webhook URL (https://n8n-vabues.onrender.com/webhook/getnames) with the user-provided input data.
- Display Name Results: Display the list of generated names, along with their meaning, origin, category tag, gender, and gradient color. Each name should be displayed in a visually appealing card format as given in reference image.
- Swipe Names: Implement swipe functionality so that users can explore through the generated names one at a time.
- Saving Names: Enable saving favorite names. Storing names will only be retained for the user's current session.
- Intelligent Prioritization: Utilize an AI tool to prioritize the name suggestions based on the 'inspirations' provided by the user, to add extra relevance to the list.

## Style Guidelines:

- Primary color: Deep blue (#1A52E1) to convey trust, and peace, related to the importance of the application.
- Background color: Light blue (#E0F7FA) to create a soft and calm ambiance.
- Accent color: Purple (#9C27B0) to highlight calls to action and interactive elements.
- Body and headline font: 'PT Sans', a humanist sans-serif for a modern yet friendly aesthetic.
- Use minimalist and meaningful icons to represent various filters like regional roots, inspirations, etc.
- Mobile-first approach with a clean, intuitive, single-column layout for easy navigation.
- Subtle transitions and animations for a smooth and engaging user experience.