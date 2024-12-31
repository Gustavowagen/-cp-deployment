import React from 'react';
import { Container, Typography, Card, CardContent, Box } from '@mui/material';

export default function HelpPage() {
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Box textAlign="center" sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Hjelp / Om oss
                </Typography>
            </Box>

            <Card sx={{ mb: 3 }} className='dark:bg-meta-4'>
                <CardContent className='dark:text-white'>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Om oss
                    </Typography>
                    <Typography variant="body1">
                        NS Solutions Klientportal er et sted der kunder av NS Solutions kan ha enklere kontakt med oss og få lettere oversikt over
                        nettsider som de har. Klientportalen tillater også kunder å endre hendelser på nettsiden deres dersom dette er avtalt og
                        satt opp. Dette kan for eksempel være informasjon om noe som skal skje i fremtiden altså noe på nettsiden som må endres. 
                        Dette gjør at kunder selv kan endre på nettsidene sine.
                        I en hendelse kan du lage en beskrivelse av hendelsen og valgfritt legge til en tid den skal skje.
                    </Typography>
                </CardContent>
            </Card>

            <Card sx={{ mb: 3 }} className='dark:bg-meta-4'>
                <CardContent className='dark:text-white'>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Vanlige problemer
                    </Typography>
                    <Box component="div" className="common-problems-list">
                        <Typography variant="body1" gutterBottom>
                            <strong>Problem 1:</strong> Meldinger sendes/vises ikke
                        </Typography>
                        <Typography variant="body2">
                            Det første steget er å passe på at du er logget inn med riktig bruker. Hvis meldinger ikke vises eller ikke sendes
                            med en gang kan du prøve å laste inn siden på nytt.
                        </Typography>
                        <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>
                            <strong>Problem 2:</strong> Jeg sendes tilbake til innloggingssiden
                        </Typography>
                        <Typography variant="body2">
                            Hvis du ikke har logget inn på en stund eller vært borte fra nettstedet en stund vil
                            din tilgang bli tilbakestillt. Dette betyr ikke at du har mistet brukeren din,
                            men bare at du må logge inn på nytt for å fornye tilgangsrettigheten på siden.
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            <Card sx={{ mb: 3 }} className='dark:bg-meta-4'>
                <CardContent className='dark:text-white'>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Kontakt
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Trenger du mer hjelp, ta kontakt
                    </Typography>
                    <Box className="contact-list" component="div">
                        <Typography variant="body2">Email: mail@gmail.com</Typography>
                        <Typography variant="body2">Tlf: 12345678</Typography>
                        <Typography variant="body2"><a href='/chat' style={{color:"#008cff"}}>Meldinger</a></Typography>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}