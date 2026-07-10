export default function QED({ noSpace }: { noSpace?: boolean }) {
  return (
    <span style={{ fontFamily: "var(--font-cmu)" }}>
      QED{noSpace ? "" : " "}
    </span>
  );
}
