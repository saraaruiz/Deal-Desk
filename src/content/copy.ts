/* All copy comes from the Figma file jgldLsdlZKwrYC2xhzIm7k (desktop 316:5948). One source of truth. */

export const nav = {
  links: [
    { label: "Who it's for", href: '#fits' },
    { label: 'How it works', href: '#moments' },
    { label: 'Limits', href: '#limits' },
  ],
  cta: 'Try the sample review',
}

export const hero = {
  h1: ['A second pair of eyes', 'before you send.'],
  sub: 'DealDesk reviews your deal message before it leaves the firm.',
  primary: 'Try the sample review',
  ghost: 'See how it works',
  micro: 'Prototype · fictional data · nothing is sent',
}

export const deals = {
  title: ['Several deals.', 'One send button.'],
  line: 'Jordan has several deals open and one message to send.',
  // Video 1 captions, one per shot (brief)
  captions: [
    'One message left.',
    'Quick update on Harbor.',
    'A second pair of eyes.',
    'Nothing leaves until you tap Send.',
    'Ready.',
    'Sent.',
  ],
}

export const look = {
  title: ['Right people.', 'Right words.', 'Latest version.'],
  line: 'Three things DealDesk looks at before Send turns on.',
  caption: 'Sample review · Project Harbor · fictional data.',
}

export const moments = {
  title: ['One message,', 'four moments.'],
  steps: [
    { step: 'Draft', line: 'Jordan writes the update.', screen: 'H5', alt: 'Draft: Pat Morgan and Alex Rivera added as recipients of the Project Harbor message' },
    { step: 'Review', line: 'DealDesk shows what to look at.', screen: 'G9', alt: 'Review: the "What to fix" list shows two items next to the people and words they concern' },
    { step: 'Ask', line: 'Dana decides on exceptions.', screen: 'A1', alt: 'Ask: a request to Dana, the deal owner, about one recipient' },
    { step: 'Send', line: 'Ready when everything is clear.', screen: 'G17', alt: 'Send: the message is Ready and the Send button is on' },
  ],
}

export const fits = {
  title: ['Fits the way your team', 'already works.'],
  line: 'DealDesk sits between the draft and Send. Approvals stay with your people.',
  roles: [
    { name: 'Coordinator', line: 'Drafts the update.' },
    { name: 'DealDesk', line: 'Looks twice.' },
    { name: 'Deal owner', line: 'Decides on exceptions.', note: 'Only when needed' },
    { name: 'Send', line: 'Ready when it is clear.' },
  ],
  label:
    'Pat and Alex are connected; Dana, the deal owner, joins the review when an exception needs a decision.',
}

export const inside = {
  title: 'Inside every review.',
  cards: {
    fix: {
      title: 'Each item sits next to what it concerns.',
      line: 'Open the list and see who, and which words, need a look.',
    },
    recipients: { title: 'Recipients', line: 'Names compared with the deal team.' },
    wording: { title: 'Wording', quote: '“Completion is guaranteed by 30 June.”', line: 'A promise of certainty gets a second look first.' },
    ask: { title: 'Ask the deal owner', state: 'PENDING', line: 'Dana decides on exceptions.' },
    edit: { title: 'After an edit', state: 'OUTDATED', line: 'Edit after review and the check restarts.' },
    record: { title: 'A short record', line: 'Keeps what was checked, and which version.', version: 'Checked version v2', to: 'To: Pat Morgan, Alex Rivera' },
  },
}

export const limits = {
  marker: 'Limits',
  title: ['A second look,', 'not a guarantee.'],
  line: 'DealDesk is clear about what it can and cannot do.',
  items: [
    { t: 'It checks recipients and wording.', d: 'It compares names with the deal team and flags promises of certainty. It can miss things, so your judgment stays in charge.', icon: 'search' },
    { t: 'Your process stays yours.', d: 'Legal and compliance review remain with your people.', icon: 'users' },
    { t: 'If the review pauses, Send waits.', d: 'Your draft is saved. Try again or keep editing.', icon: 'pause' },
    { t: 'This prototype is a sample.', d: 'Nothing is sent. Every name and message is fictional.', icon: 'file' },
  ] as const,
}

export const invite = {
  title: ['Look twice.', 'Send once.'],
  line: 'Open the Project Harbor draft and see how it feels.',
  cta: 'Try the sample review',
  micro: 'Prototype · fictional data · nothing is sent',
}

export const footer = {
  links: nav.links,
  disclaimer: 'DealDesk is a fictional product made for a design exercise. All names, firms, deals and messages are examples.',
  legal: 'Prototype · fictional data · nothing is sent',
}
