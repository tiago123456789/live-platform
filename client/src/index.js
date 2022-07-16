import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom/"
import ReactDOM from 'react-dom/client';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import App from './App';
import Login from './pages/Login';
import Lives from './pages/Lives';
import OAuthCallback from './pages/OAuthCallback';
import NotFound from './pages/NotFound';
import Channel from './pages/Channel';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import BotCommand from './pages/BotCommand';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/channel/:channel/live" element={<ProtectedRoute component={App} />}/>
      <Route path="/channel/:channel" element={<ProtectedRoute component={Channel} />}/>
      <Route path="/oauth-callback" element={<OAuthCallback />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/lives" element={<ProtectedRoute component={Lives} /> } />
      <Route path="/channel/:channel/bot-commands" element={<ProtectedRoute component={BotCommand} /> } />
      <Route
        path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

