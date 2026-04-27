import { PROFILE } from '../config/profile'

export const SYSTEM_METADATA = {
  name: `${PROFILE.firstName}OS`,
  version: '3.0',
  codename: 'Operator',
  tagline: 'A browser-native portfolio rebuilt as a serious product experience.',
  summary:
    'This system turns a childhood idea into a product-minded portfolio: custom windowing, cross-app workflows, persistent state, and an operating environment that is useful instead of purely theatrical.'
}

export const SYSTEM_METRICS = [
  { label: 'Desktop apps', value: '13', note: 'Lazy-loaded windows and shared shell' },
  { label: 'Interaction layer', value: '8', note: 'Shortcuts, notifications, drag, resize, snap' },
  { label: 'Persistent modules', value: '4', note: 'Appearance, notes, explorer, desktop state' },
  { label: 'Design direction', value: '1', note: 'Unified visual language across the OS' }
]

export const CAPABILITY_GROUPS = [
  {
    title: 'Frontend Systems',
    summary: 'Turning complex interaction surfaces into stable, understandable UI.',
    items: ['React architecture', 'State modeling', 'Component composition', 'Performance tuning']
  },
  {
    title: 'Product Craft',
    summary: 'Building interfaces that feel intentional, credible, and pleasant to use.',
    items: ['Interaction design', 'UX writing', 'Visual consistency', 'Information hierarchy']
  },
  {
    title: 'Platform Thinking',
    summary: 'Designing for flows between apps, not just isolated screens.',
    items: ['Cross-app navigation', 'Session persistence', 'Keyboard ergonomics', 'System behaviors']
  }
]

export const PROJECTS = [
  {
    id: 'browser-os-system',
    title: 'Browser OS System',
    status: 'Shipped',
    year: '2026',
    summary:
      'A portfolio presented as a browser-resident operating system with draggable windows, a taskbar, launcher, apps, keyboard shortcuts, and system polish.',
    outcome:
      'This is the flagship build: it shows product thinking, frontend systems work, and willingness to push a concept until it becomes memorable.',
    stack: ['React 19', 'Vite', 'Custom window manager', 'Local persistence', 'CSS design system'],
    focus: ['Window lifecycle', 'Desktop interactions', 'Cross-app state', 'Performance-minded loading'],
    metrics: ['13 apps', 'Global shortcut layer', 'Notification system', 'Persistent notes and files']
  },
  {
    id: 'senior-rebuild',
    title: 'Senior-Level Rebuild',
    status: 'Current',
    year: '2026',
    summary:
      'A ground-up upgrade of the original grade-school concept into a portfolio OS that reads like a product instead of a novelty demo.',
    outcome:
      'The rebuild focused on honesty, cohesion, and real functionality: no fake resume history, fewer placeholders, more working tools.',
    stack: ['Shared data model', 'System API', 'Theme variables', 'Command parser', 'App persistence'],
    focus: ['Truthful content', 'Reusable data', 'Better workflows', 'Sharper visual system'],
    metrics: ['Unified portfolio data', 'Internal browser pages', 'Functional file operations', 'Notes autosave']
  },
  {
    id: 'interaction-engine',
    title: 'Interaction Engine',
    status: 'System module',
    year: '2026',
    summary:
      'The invisible layer behind the OS feeling: keyboard shortcuts, drag behavior, window focus, desktop selection, and ambient feedback.',
    outcome:
      'This is the difference between a pretty mockup and a tool that actually feels alive under your hands.',
    stack: ['Custom managers', 'Event-driven actions', 'Notification hooks', 'Focus management'],
    focus: ['Alt+Tab flow', 'Desktop affordances', 'Launch latency', 'Consistent interaction timing'],
    metrics: ['Custom keyboard manager', 'Window focus rules', 'Desktop grid snapping', 'Notification feedback']
  }
]

export const SKILL_GROUPS = [
  {
    id: 'frontend',
    title: 'Frontend Engineering',
    description: 'Building rich interfaces that stay understandable as they grow.',
    skills: [
      { name: 'React architecture', level: 92 },
      { name: 'JavaScript', level: 90 },
      { name: 'State modeling', level: 88 },
      { name: 'CSS systems', level: 89 }
    ]
  },
  {
    id: 'product',
    title: 'Product Craft',
    description: 'Translating a concept into a polished, usable experience.',
    skills: [
      { name: 'Interaction design', level: 90 },
      { name: 'UX writing', level: 78 },
      { name: 'Information design', level: 84 },
      { name: 'Visual systems', level: 86 }
    ]
  },
  {
    id: 'systems',
    title: 'Systems Thinking',
    description: 'Seeing the app as a connected environment instead of isolated screens.',
    skills: [
      { name: 'Window orchestration', level: 88 },
      { name: 'App boundaries', level: 84 },
      { name: 'Persistence strategy', level: 82 },
      { name: 'Performance tradeoffs', level: 80 }
    ]
  }
]

export const ABOUT_SECTIONS = [
  {
    title: 'Why this exists',
    body:
      'The original idea came from building something playful early on. The senior version keeps that energy but grounds it in clearer architecture, better writing, and tools that actually work.'
  },
  {
    title: 'What it shows',
    body:
      'It demonstrates more than UI taste: state management, system behavior, interaction design, and the ability to hold a big concept together over time.'
  },
  {
    title: 'How I like to work',
    body:
      'I like interfaces with personality, but I care just as much about clarity, durability, and whether the whole thing still feels coherent after the fifth new feature.'
  }
]

export const RESUME_DOSSIER = {
  headline: 'Frontend engineer building product-grade interfaces with systems thinking.',
  summary:
    'This portfolio intentionally avoids invented employers and fake credentials. It focuses on demonstrated ability: shipping rich browser interactions, structuring state cleanly, and turning ambitious UI concepts into something people can actually use.',
  strengths: [
    'Designs interaction-heavy frontend systems without leaning on heavyweight UI kits.',
    'Balances novelty with product discipline so the experience feels memorable and credible.',
    'Builds reusable data and state layers that keep expanding apps from turning into spaghetti.',
    'Cares about the details users feel: copy, layout stability, rhythm, and feedback.'
  ],
  proof: [
    'Custom desktop shell with draggable, resizable, focus-aware windows.',
    'Cross-app system API for navigation, notifications, and shared preferences.',
    'Persistent note-taking and file explorer workflows stored in the browser.',
    'Keyboard-first patterns including launcher search, task switching, and terminal actions.'
  ],
  nextStep:
    'Use this dossier as the on-screen profile and attach a formal resume PDF later if needed. The structure is ready for verified experience, education, and project history.'
}

export const CONTACT_CHANNELS = [
  {
    label: 'Email',
    value: PROFILE.email,
    href: `mailto:${PROFILE.email}`,
    note: 'Best for serious opportunities and project inquiries.'
  },
  {
    label: 'GitHub',
    value: PROFILE.github,
    href: `https://${PROFILE.github}`,
    note: 'Code, experiments, and technical direction.'
  },
  {
    label: 'LinkedIn',
    value: PROFILE.linkedin,
    href: `https://${PROFILE.linkedin}`,
    note: 'Professional profile and network.'
  },
  {
    label: 'Location',
    value: PROFILE.location,
    href: null,
    note: 'Remote-friendly collaboration from the UAE.'
  }
]

export const BROWSER_PAGES = [
  {
    path: '/start',
    title: 'Welcome',
    description: 'Landing page for the internal browser.',
    sections: [
      {
        heading: SYSTEM_METADATA.name,
        body: SYSTEM_METADATA.summary
      },
      {
        heading: 'Jump points',
        body: 'Open /projects, /skills, /contact, /resume, or /system to browse the portfolio like a tiny local intranet.'
      }
    ]
  },
  {
    path: '/projects',
    title: 'Projects',
    description: 'Flagship builds and product slices.',
    sections: PROJECTS.map((project) => ({
      heading: project.title,
      body: `${project.summary} ${project.outcome}`
    }))
  },
  {
    path: '/skills',
    title: 'Skills',
    description: 'Capability groups and skill levels.',
    sections: SKILL_GROUPS.map((group) => ({
      heading: group.title,
      body: `${group.description} Focus areas: ${group.skills.map((skill) => `${skill.name} ${skill.level}%`).join(', ')}.`
    }))
  },
  {
    path: '/contact',
    title: 'Contact',
    description: 'Direct contact routes.',
    sections: CONTACT_CHANNELS.map((channel) => ({
      heading: channel.label,
      body: `${channel.value}${channel.note ? ` - ${channel.note}` : ''}`
    }))
  },
  {
    path: '/resume',
    title: 'Resume',
    description: 'Narrative profile summary.',
    sections: [
      { heading: 'Summary', body: RESUME_DOSSIER.summary },
      { heading: 'Strengths', body: RESUME_DOSSIER.strengths.join(' ') },
      { heading: 'Proof', body: RESUME_DOSSIER.proof.join(' ') }
    ]
  },
  {
    path: '/system',
    title: 'System',
    description: 'What is inside the OS shell.',
    sections: SYSTEM_METRICS.map((metric) => ({
      heading: `${metric.label}: ${metric.value}`,
      body: metric.note
    }))
  }
]

export const DEFAULT_NOTES = [
  {
    id: 'rebuild-brief',
    title: 'Rebuild brief',
    pinned: true,
    updatedAt: '2026-04-27T19:20:00.000Z',
    content: `Take the original grade-school concept seriously.\n\nGoals:\n- Keep the browser OS idea.\n- Make the UI feel deliberate.\n- Replace placeholders with truthful content.\n- Turn demos into working tools.\n- Ship something that feels senior-level.`
  },
  {
    id: 'ship-checklist',
    title: 'Ship checklist',
    pinned: false,
    updatedAt: '2026-04-27T19:25:00.000Z',
    content: `Before pushing:\n- Build cleanly\n- Check launcher search\n- Open core apps\n- Verify notes persistence\n- Verify file explorer actions`
  },
  {
    id: 'future-ideas',
    title: 'Future ideas',
    pinned: false,
    updatedAt: '2026-04-27T19:30:00.000Z',
    content: `Potential next steps:\n- Terminal tab support\n- Real wallpaper picker with image uploads\n- Export notes as markdown\n- Add command palette inside the browser app`
  }
]

function createNode({ id, name, type, children = [], content = '', meta = {} }) {
  return {
    id,
    name,
    type,
    content,
    children,
    updatedAt: meta.updatedAt || new Date().toISOString(),
    size: meta.size || (content ? `${content.length} B` : '--'),
    extension: meta.extension || '',
    label: meta.label || ''
  }
}

export function createDefaultExplorerTree() {
  const projectFiles = PROJECTS.map((project) =>
    createNode({
      id: `project-${project.id}`,
      name: `${project.id}.md`,
      type: 'file',
      content: `# ${project.title}\n\nStatus: ${project.status}\nYear: ${project.year}\n\n${project.summary}\n\nOutcome: ${project.outcome}\n\nStack: ${project.stack.join(', ')}\n\nFocus: ${project.focus.join(', ')}`,
      meta: { extension: 'md' }
    })
  )

  const noteFiles = DEFAULT_NOTES.map((note) =>
    createNode({
      id: `note-${note.id}`,
      name: `${note.title.toLowerCase().replace(/\s+/g, '-')}.md`,
      type: 'file',
      content: note.content,
      meta: { extension: 'md', updatedAt: note.updatedAt }
    })
  )

  return createNode({
    id: 'workspace-root',
    name: 'Workspace',
    type: 'folder',
    children: [
      createNode({
        id: 'portfolio-folder',
        name: 'Portfolio',
        type: 'folder',
        children: [
          createNode({
            id: 'readme-file',
            name: 'README.md',
            type: 'file',
            content: `# ${SYSTEM_METADATA.name}\n\n${SYSTEM_METADATA.summary}`,
            meta: { extension: 'md' }
          }),
          createNode({
            id: 'profile-file',
            name: 'profile.json',
            type: 'file',
            content: JSON.stringify(PROFILE, null, 2),
            meta: { extension: 'json' }
          }),
          ...projectFiles
        ]
      }),
      createNode({
        id: 'notes-folder',
        name: 'Notes',
        type: 'folder',
        children: noteFiles
      }),
      createNode({
        id: 'system-folder',
        name: 'System',
        type: 'folder',
        children: [
          createNode({
            id: 'shortcuts-file',
            name: 'shortcuts.txt',
            type: 'file',
            content:
              'Ctrl+Space open launcher\nCtrl+` open terminal\nCtrl+W close active window\nAlt+Tab cycle windows\nCtrl+L lock system',
            meta: { extension: 'txt' }
          }),
          createNode({
            id: 'manifest-file',
            name: 'system-manifest.txt',
            type: 'file',
            content: SYSTEM_METRICS.map((metric) => `${metric.label}: ${metric.value} - ${metric.note}`).join('\n'),
            meta: { extension: 'txt' }
          })
        ]
      })
    ]
  })
}
