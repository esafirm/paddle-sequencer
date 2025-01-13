interface ContainerProps {
  children: React.ReactNode;
}

export default function Container(props: ContainerProps) {
  return (
    <div className="mx-auto flex justify-center items-center h-screen bg-gray-900">
      <div className="container bg-gray-950 max-w-2xl mx-auto p-8 rounded-lg">
        <header>
          <h1 className="text-4xl font-light text-white tracking-wide mb-8">
            React Sequencer
          </h1>
        </header>

        {props.children}

        <footer className="mt-8 text-white opacity-60">
          Made by{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://nolambda.stream"
            className="font-medium border-b border-dotted hover:border-solid"
          >
            esafirm
          </a>
          .
        </footer>
      </div>
    </div>
  );
}
