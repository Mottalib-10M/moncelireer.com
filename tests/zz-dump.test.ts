import { it } from 'vitest';
import { writeFileSync } from 'node:fs';
import { guideById } from '../src/lib/pages';
import { helpers } from '../src/lib/helpers';
const strip = (s: string) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
it('dump', () => { const ids = (process.env.IDS ?? '').split(','); const o: string[] = []; for (const id of ids) for (const l of ['fr', 'en'] as const) { const g = guideById(id)![l]; o.push(`== ${id} ${l}`, g.title, g.description, g.card, g.resume, strip(g.body(helpers(l))), ...g.faqs.map((f) => f.q + ' :: ' + f.a)); } writeFileSync('/private/tmp/claude-501/-Users-mottalib-Documents-GitHub-a-publier-Mottalib-10M-seo-platform/a4e41413-2f4d-4dcc-950b-127d636d4e1d/scratchpad/page-dump.txt', o.join('\n')); });
