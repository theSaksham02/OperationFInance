'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Slide from '@mui/material/Slide';
import { ChatDotsIcon } from '@phosphor-icons/react/dist/ssr/ChatDots';
import { PaperPlaneTiltIcon } from '@phosphor-icons/react/dist/ssr/PaperPlaneTilt';
import { XIcon } from '@phosphor-icons/react/dist/ssr/X';

import chatbotData from '@/data/chatbot.json';

interface ChatEntry {
  role: 'user' | 'assistant';
  content: string;
}

interface FAQEntry {
  question: string;
  answer: string;
}

function findBestMatch(query: string, faqs: FAQEntry[]): string {
  const normalizedQuery = query.toLowerCase();
  const match = faqs.find((faq) => normalizedQuery.includes(faq.question.split(' ')[0].toLowerCase())) ?? faqs[0];
  return match?.answer ?? '';
}

export function AiChatbot(): React.JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [history, setHistory] = React.useState<ChatEntry[]>([
    { role: 'assistant', content: 'Hey there! Ask me anything about Uptrade.' },
  ]);

  const faqs = chatbotData as FAQEntry[];

  const sendMessage = React.useCallback(() => {
    if (!inputValue.trim()) {
      return;
    }

    const userMessage: ChatEntry = { role: 'user', content: inputValue.trim() };
    const assistantMessage: ChatEntry = {
      role: 'assistant',
      content: findBestMatch(inputValue, faqs),
    };

    setHistory((prev) => [...prev, userMessage, assistantMessage]);
    setInputValue('');
  }, [inputValue, faqs]);

  return (
    <>
      <Fab
        color="primary"
        variant="extended"
        sx={{ position: 'fixed', right: 24, bottom: 24, zIndex: (theme) => theme.zIndex.modal + 1 }}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <ChatDotsIcon fontSize="var(--icon-fontSize-lg)" style={{ marginRight: 8 }} />
        Ask Uptrade AI
      </Fab>
      <Slide direction="up" timeout={200} in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={12}
          sx={{
            position: 'fixed',
            bottom: 96,
            right: 24,
            width: 360,
            maxWidth: 'calc(100vw - 48px)',
            borderRadius: 3,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Uptrade Copilot
            </Typography>
            <IconButton aria-label="Close chat" onClick={() => setIsOpen(false)}>
              <XIcon fontSize="var(--icon-fontSize-md)" />
            </IconButton>
          </Stack>
          <Divider />
          <Box sx={{ p: 2, flexGrow: 1, overflowY: 'auto', maxHeight: 320 }}>
            <Stack spacing={2}>
              {history.map((entry, index) => (
                <Box
                  key={`${entry.role}-${index}`}
                  sx={{
                    alignSelf: entry.role === 'user' ? 'flex-end' : 'flex-start',
                    bgcolor: entry.role === 'user' ? 'primary.main' : 'background.level2',
                    color: entry.role === 'user' ? 'primary.contrastText' : 'text.primary',
                    px: 2,
                    py: 1.25,
                    borderRadius: 2,
                    maxWidth: '75%',
                  }}
                >
                  <Typography variant="body2">{entry.content}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
          <Divider />
          <Stack direction="row" spacing={1} sx={{ p: 2 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Ask about trading..."
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  sendMessage();
                }
              }}
            />
            <IconButton color="primary" onClick={sendMessage} aria-label="Send message">
              <PaperPlaneTiltIcon fontSize="var(--icon-fontSize-md)" />
            </IconButton>
          </Stack>
        </Paper>
      </Slide>
    </>
  );
}
