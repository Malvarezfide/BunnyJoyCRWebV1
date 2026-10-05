import Button from "../components/common/Button";
import usePageMeta from "../hooks/usePageMeta";

function NotFound() {
  usePageMeta({
    title: "Página no encontrada · BunnyJoy",
    description: "La página que buscas no existe.",
    noindex: true,
  });

  return (
    <main className="text-center py-20 px-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Página no encontrada 🐰
      </h1>

      <p className="mt-3 text-gray-500">
        La dirección que abriste no existe.
      </p>

      <div className="mt-8">
        <Button to="/">Ir al inicio</Button>
      </div>
    </main>
  );
}

export default NotFound;
