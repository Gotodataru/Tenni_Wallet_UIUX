import './Skeleton.css'

/**
 * L3 · Skeleton
 *
 * Used INSIDE other components while loading, not instead of them —
 * a component that can load decides where to put a Skeleton of the
 * right size (see Balance.jsx).
 *
 * props: shape (line|circle|rect), w (px, optional — without it the
 *        skeleton stretches to the parent via align-self: stretch,
 *        Figma's Fill container, not a literal width: 100%),
 *        h (px), radius
 */
export function Skeleton({ shape = 'line', w, h = 16, radius, className = '', style, ...rest }) {
  const cls = ['Skeleton', `Skeleton--${shape}`, w === undefined && 'Skeleton--fill', className].filter(Boolean).join(' ')
  const inline = {
    ...(w !== undefined ? { width: `${w}px`, flex: '0 0 auto' } : null),
    height: `${h}px`,
    ...(radius ? { borderRadius: radius } : null),
    ...style,
  }

  return <span className={cls} style={inline} aria-hidden="true" {...rest} />
}
