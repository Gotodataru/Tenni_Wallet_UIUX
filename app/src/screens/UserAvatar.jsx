import { Avatar } from '../ui/index.js'

/** The signed-in person: their photo, or initials for an account made in the demo. */
export function UserAvatar({ user, size = 40, ring = false }) {
  return user.photo
    ? <Avatar type="image" src={user.photo} size={size} ring={ring} />
    : <Avatar type="initials" initials={user.initials} size={size} ring={ring} />
}
