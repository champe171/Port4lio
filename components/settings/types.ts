export type IconPickerTarget =
  | { kind: 'social'; socialIndex: number }
  | null

export type UploadingState = {
  avatar: boolean
  cv: boolean
  heroLeft: boolean
  heroRight: boolean
  introPhoto: boolean
  /** index → uploading cover photo for that experience row */
  expCoverUploading: Record<number, boolean>
}
