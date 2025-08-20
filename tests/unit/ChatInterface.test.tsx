import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { jest } from '@jest/globals';
import ChatInterface from '../components/ChatInterface';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ChatInterface Component', () => {
  
  beforeEach(() => {
    mockedAxios.post.mockClear();
  });

  it('should render chat interface', () => {
    render(<ChatInterface />);
    
    expect(screen.getByPlaceholderText(/escribe tu comando/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
  });

  it('should send message and display response', async () => {
    const mockResponse = {
      data: { response: 'Volumen del piano aumentado a nivel 7' }
    };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    render(<ChatInterface />);
    
    const input = screen.getByPlaceholderText(/escribe tu comando/i);
    const sendButton = screen.getByRole('button', { name: /enviar/i });

    fireEvent.change(input, { target: { value: 'sube el volumen del piano' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/volumen del piano aumentado/i)).toBeInTheDocument();
    });

    expect(mockedAxios.post).toHaveBeenCalledWith('/api/chat', {
      message: 'sube el volumen del piano'
    });
  });

  it('should handle API errors gracefully', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));

    render(<ChatInterface />);
    
    const input = screen.getByPlaceholderText(/escribe tu comando/i);
    const sendButton = screen.getByRole('button', { name: /enviar/i });

    fireEvent.change(input, { target: { value: 'comando de prueba' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/error de conexión/i)).toBeInTheDocument();
    });
  });

  it('should clear input after sending message', async () => {
    const mockResponse = {
      data: { response: 'Comando procesado' }
    };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    render(<ChatInterface />);
    
    const input = screen.getByPlaceholderText(/escribe tu comando/i) as HTMLInputElement;
    const sendButton = screen.getByRole('button', { name: /enviar/i });

    fireEvent.change(input, { target: { value: 'test message' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('should disable send button when input is empty', () => {
    render(<ChatInterface />);
    
    const sendButton = screen.getByRole('button', { name: /enviar/i });
    expect(sendButton).toBeDisabled();
  });

  it('should enable send button when input has text', () => {
    render(<ChatInterface />);
    
    const input = screen.getByPlaceholderText(/escribe tu comando/i);
    const sendButton = screen.getByRole('button', { name: /enviar/i });

    fireEvent.change(input, { target: { value: 'test' } });
    expect(sendButton).not.toBeDisabled();
  });

  it('should show loading state while sending message', async () => {
    const mockResponse = {
      data: { response: 'Respuesta de prueba' }
    };
    
    // Mock a delayed response
    mockedAxios.post.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
    );

    render(<ChatInterface />);
    
    const input = screen.getByPlaceholderText(/escribe tu comando/i);
    const sendButton = screen.getByRole('button', { name: /enviar/i });

    fireEvent.change(input, { target: { value: 'test message' } });
    fireEvent.click(sendButton);

    expect(screen.getByText(/enviando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/enviando/i)).not.toBeInTheDocument();
    });
  });
});
