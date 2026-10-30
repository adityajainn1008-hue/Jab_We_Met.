<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- All personal story copy (chapters, quiz, letter, pop-up notes) lives in src/content/story.ts; components only render it — so the story stays editable in one place.
- Sounds and music are synthesized with Web Audio in src/lib/sound.ts — no licensed audio files needed, nothing autoplays.
