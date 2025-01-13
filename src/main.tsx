import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Sequencer from './Sequencer';
import Container from './Contaienr';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Container>
      <Sequencer />
    </Container>
  </StrictMode>
);
