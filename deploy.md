# Convención de commits y atribución — Guía San Juan - Portal Ciudadano

> Fuente de verdad para CÓMO se firman los commits y CÓMO se refleja la autoría real
> en Linear. Aplica a **toda persona o IA** que trabaje en este repo.

## Autor de commit (siempre el mismo)

Todo commit se firma con la cuenta compartida del equipo, **nunca** con la cuenta
personal de quien lo sube:

- Nombre: `Trinium MX`
- Email: `triniummx@gmail.com`

## Coautor (quién hizo el trabajo realmente)

Cada commit lleva uno o más *trailers* `Co-authored-by`, identificando a la persona
que hizo el trabajo **más** la IA usada. Personas del equipo:

| Persona | Email |
|---|---|
| Carlos Adrian | catr2777@gmail.com |
| Israel Basurto | oesedseven@gmail.com |
| Javier López | jl728122@gmail.com |

## Regla para la IA antes de commitear

Si no es evidente por el contexto de la sesión (email del usuario del sistema,
o algo que ya dijo explícitamente en la conversación) **quién** está al mando,
la IA **debe preguntar** algo como: *"¿Eres Isra, Carlos o Javier?"* antes de
crear el commit. Nunca se omite el coautor ni se asume sin confirmar.

## Formato de commit

```bash
git commit --author="Trinium MX <triniummx@gmail.com>" -m "$(cat <<'EOF'
<tipo>: <resumen breve>

Co-authored-by: <Nombre Persona> <email-persona>
Co-authored-by: <Nombre IA> <email-o-noreply-de-la-ia>
EOF
)"
```

- `--author` fija el autor visible del commit (Trinium MX) sin tocar `git config`
  global/local de la máquina (cada quien conserva su propia identidad de git para
  otros repos).
- Puede haber más de un `Co-authored-by` humano si dos personas trabajaron la
  misma tarea.

## Push obligatorio

Un commit no se considera terminado hasta que se sube al remoto (`git push`).
Commitear y dejar el trabajo solo en local **no cumple** esta convención — el
equipo (y Linear) necesitan verlo reflejado en GitHub. La IA debe hacer `git push`
después de cada commit (o tanda de commits) de una tarea, salvo que el usuario
pida explícitamente no subirlo todavía.

## Linear

El proyecto correspondiente en Linear es **Guía San Juan - Portal Ciudadano**. Cada tarea (issue) que se marca como completada debe dejar constancia de quién la realizó (persona + IA usada), igual que en el commit — por ejemplo en un comentario de la tarea o en su descripción. Si no se sabe quién la trabajó, se pregunta antes de actualizar/cerrar el issue (misma regla que arriba).
