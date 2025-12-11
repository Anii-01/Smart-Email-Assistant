import { Typography, Container, Box, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Button } from '@mui/material';
import './App.css';
import { useState } from 'react';
import axios from 'axios';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedReply, setGeneratedReply] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setGeneratedReply('');
    setError('');

    try {
      //Send as JSON object
      const response = await axios.post("http://localhost:8080/api/email/generate", {
  emailContent,
  tone
});


      //Handle backend response properly
      setGeneratedReply(
        typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data)
      );
    } catch (err) {
      console.error(err);
      setError('Failed to generate reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Email Reply Generator
      </Typography>

      <Box sx={{ mx: 3, mt: 4 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          label="Original Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 3 }}
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select
            value={tone}
            label="Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!emailContent || loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Reply'}
        </Button>
      </Box>

      {/* Show error message if API fails */}
      {error && (
        <Typography color="error" sx={{ mx: 3, mt: 2 }}>
          {error}
        </Typography>
      )}

      {/* Show generated reply only if present */}
      {generatedReply && (
        <Box sx={{ mx: 3, mt: 4 }}>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            label="Generated Reply"
            value={generatedReply}
            InputProps={{ readOnly: true }}
            sx={{ mb: 2 }}
          />

          <Button
            variant="outlined"
            onClick={() => navigator.clipboard.writeText(generatedReply)}
          >
            Copy to Clipboard
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default App;
