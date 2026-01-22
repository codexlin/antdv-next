import hash from '@emotion/hash'

export default (src: string) => (hash as any).default && (typeof (hash as any).default === 'function') ? (hash as any).default(src) : hash(src)
