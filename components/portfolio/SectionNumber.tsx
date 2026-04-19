interface Props {
  number: string
}

export default function SectionNumber({ number }: Props) {
  return (
    <span className="section-num text-portfolio-gray absolute top-0 right-0">
      {number}
    </span>
  )
}
