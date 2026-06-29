import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar, Alert, Tabs, Tab } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';

const defaultTheme = createTheme({
    palette: {
        primary: {
            main: '#6366f1', // Premium Indigo
        },
        secondary: {
            main: '#10b981', // Emerald Green
        },
    },
});

export default function Authentication() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [error, setError] = React.useState("");
    const [message, setMessage] = React.useState("");

    // formState: 0 for Sign In, 1 for Sign Up
    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    const handleTabChange = (event, newValue) => {
        setFormState(newValue);
        setError("");
        setUsername("");
        setPassword("");
        setEmail("");
    };

    let handleAuth = async () => {
        try {
            if (formState === 0) {
                await handleLogin(username, password);
            } else if (formState === 1) {
                let result = await handleRegister(email, username, password);
                console.log(result);
                setMessage(result);
                setOpen(true);
                setError("");
                setUsername("");
                setPassword("");
                setEmail("");
                setFormState(0); // Redirect to Sign In after successful registration
            }
        } catch (err) {
            console.log(err);
            if (err.response && err.response.data) {
                let errorMsg = err.response.data.message;
                setError(errorMsg);
            } else {
                setError("Something went wrong, please try again.");
            }
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            {/* Main container with absolute screen coverage */}
            <Box sx={{ height: '100vh', width: '100vw', display: 'flex', overflow: 'hidden' }}>
                <CssBaseline />
                
                {/* Left Side: Branding and Platform Features suitable for Coding Interviews */}
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                        display: { xs: 'none', md: 'flex' },
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        p: 5,
                        textAlign: 'center',
                        width: '58%' // डाव्या बाजूला ५८% जागा दिली आहे
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, bgcolor: '#334155', p: 2, borderRadius: '16px' }}>
                        <CodeCallIcon sx={{ fontSize: '50px', color: '#6366f1', mr: 2 }} />
                        <Typography variant="h3" fontWeight="bold" sx={{ letterSpacing: '1px' }}>
                            CodeCall
                        </Typography>
                    </Box>
                    
                    <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#38bdf8' }}>
                        Seamless Technical Interviews
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.8, maxWidth: 450, mt: 2 }}>
                        Conduct live video interviews, collaborate on real-time coding tasks, and evaluate candidates efficiently in our integrated environment.
                    </Typography>
                </Box>

                {/* Right Side: Compact Authentication Form Box occupying exactly the remaining width */}
                <Box 
                    component={Paper}
                    elevation={6}
                    square
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        bgcolor: '#f8fafc',
                        width: { xs: '100%', md: '42%' }, // उजव्या बाजूला अचूक ४२% जागा राहील
                        height: '100%',
                        position: 'relative'
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: 360, // लहान आकाराचा कॉम्पॅक्ट बॉक्स
                            mx: 3,
                            p: 3,
                            bgcolor: '#ffffff',
                            borderRadius: '16px',
                            boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 0.5, bgcolor: 'primary.main', width: 42, height: 42 }}>
                            <LockOutlinedIcon fontSize="medium" />
                        </Avatar>

                        <Typography component="h1" variant="h6" sx={{ mb: 0.5, fontWeight: 'bold', mt: 1 }}>
                            {formState === 0 ? "Welcome Back" : "Join the Platform"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                            {formState === 0 ? "Access your dashboard to start interviews" : "Register to collaborate and code"}
                        </Typography>

                        {/* Tabs for Sign In / Sign Up */}
                        <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider', mb: 1 }}>
                            <Tabs value={formState} onChange={handleTabChange} centered textColor="primary" indicatorColor="primary">
                                <Tab label="Sign In" sx={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'none' }} />
                                <Tab label="Sign Up" sx={{ fontWeight: 'bold', fontSize: '14px', textTransform: 'none' }} />
                            </Tabs>
                        </Box>

                        <Box component="form" noValidate sx={{ mt: 0.5, width: '100%' }}>
                            {/* email Field - Visible only on Sign Up */}
                            {formState === 1 && (
                                <TextField
                                    margin="dense"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email"
                                    name="email"
                                    value={email}
                                    autoFocus
                                    onChange={(e) => setEmail(e.target.value)}
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': { borderRadius: '8px' } 
                                    }}
                                />
                            )}

                            <TextField
                                margin="dense"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                value={username}
                                autoFocus={formState === 0}
                                onChange={(e) => setUsername(e.target.value)}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': { borderRadius: '8px' } 
                                }}
                            />
                            
                            <TextField
                                margin="dense"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': { borderRadius: '8px' } 
                                }}
                            />

                            {/* Error Display */}
                            {error && (
                                <Typography color="error" variant="body2" sx={{ mt: 1, fontWeight: '500', fontSize: '12px' }}>
                                    {error}
                                </Typography>
                            )}

                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ 
                                    mt: 3, 
                                    mb: 1, 
                                    py: 1.2, 
                                    fontSize: '15px', 
                                    fontWeight: 'bold',
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.3)'
                                }}
                                onClick={handleAuth}
                            >
                                {formState === 0 ? "Sign In" : "Sign Up"}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Success Notification */}
            <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%', fontSize: '14px' }}>
                    {message}
                </Alert>
            </Snackbar>
        </ThemeProvider>
    );
}

// Custom icon component mimicking Code Icon for left panel
function CodeCallIcon(props) {
    return (
        <CodeIcon {...props} />
    );
}