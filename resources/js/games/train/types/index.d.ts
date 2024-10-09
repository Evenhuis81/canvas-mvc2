type MoveDirection = 'up' | 'down' | 'left' | 'right' | 'none';

type CollisionCheck = (
    pos: Vector,
    vel: Vector,
    cur: Vector,
    mov: {dir: MoveDirection},
) => {[K in Exclude<MoveDirection, 'none'>]: () => void};
