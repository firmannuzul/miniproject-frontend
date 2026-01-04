interface CardProps {
  title: string;
  content: string;
  logo: React.ReactNode;
}

function Card(props: CardProps) {
  return (
    <div className="h-[180px]  border rounded-4xl p-8 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xl">{props.title}</p>
        <div> {props.logo}</div>
      </div>
      <p className="text-3xl font-bold">{props.content}</p>
    </div>
  );
}

export default Card;
