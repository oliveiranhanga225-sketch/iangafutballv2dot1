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

- The public game remains in `public/jogo.html`, embedded by the index route; preserve its existing canvas and HUD instead of rebuilding the interface.
- Online mode rooms use the shared OT lobby and capability-protected host RPCs; both online menu entry points must reach this same mode selector to prevent bypassing the lobby.
- Public room discovery queries only opt-in lobby metadata; visibility changes use the existing host-key-protected OT write path, and direct entry reuses `ot_join` so capacity and lobby rules remain shared.
- Career tests submit authenticated profile results through `ot_career_test` before the host advances the shared competition; do not reuse the offline season advancement for shared matches.
- Background selection persists in game settings and is applied to the document theme; never overwrite the saved choice during initialization.
- Friend requests and room invitations use capability-authenticated database inbox RPCs, not PeerJS, so delivery works across networks and when recipients return; preserve the independent queued invitation dialog outside matches. PeerJS remains only for live gameplay and legacy compatibility.
- Human competition matches enter their live PeerJS connection only after each participant confirms Iniciar; preserve the host/guest rendezvous so either click order waits for the other player.
- Human launch windup captures the target on CHUTAR and synchronizes its progress in gameplay snapshots; bot serve timing stays independent.
- Online guests predict their own movement locally and send their position; the host applies it and keeps simulating from a worker timer when its tab is in the background, so the guest never freezes waiting on the host's screen.
- All live online transports apply guest input through `applyRemoteInput`, clear remote positions on reset/disconnect, and extrapolate recent positions between packets; this keeps movement consistent across modes and match transitions.
