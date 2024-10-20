export default function Page({ params }: { params: { key: string } }) {
  return (
    <div>
      <h1>Project {params.key}</h1>
    </div>
  );
}
