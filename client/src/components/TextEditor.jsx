export default function TextEditor({ el, update }) {
  return (
    <textarea
      className="w-full h-full p-2"
      value={el.content}
      onChange={(e) => update(el.id, { content: e.target.value })}
    />
  );
}
