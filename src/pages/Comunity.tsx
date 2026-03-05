import { Box, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { GetTokenId } from "../api/auth";
import { GetBooks } from "../api/request";
import ListRaad from "../components/comunity/ListRaad";
import { ClientBooks } from "../interfaces/MyBooks";
import { translate } from "react-i18nify";

function EmptyState({ label }: { label: string }) {
    return (
        <Box
            sx={{
                textAlign: 'center',
                py: 4,
                px: 2,
            }}
        >
            <Typography variant="body2" color="text.disabled">
                {label}
            </Typography>
        </Box>
    );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <Typography
            variant="caption"
            sx={{
                display: 'block',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'text.secondary',
                mt: 3,
                mb: 1.5,
                px: 2,
            }}
        >
            {children}
        </Typography>
    );
}

const Comunity = () => {
    const [books, setBooks] = useState<ClientBooks[]>([]);
    const [_, myClientId] = GetTokenId();

    useEffect(() => {
        GetBooks((n: ClientBooks[]) => setBooks(n));
    }, []);

    const myBooks = books.filter((item: ClientBooks) => item.clientId === +myClientId);
    const otherBooks = books.filter((item: ClientBooks) => item.clientId !== +myClientId);

    return (
        <Box sx={{ pt: '80px', pb: '80px' }}>
            {/* My bookings */}
            <SectionLabel>{translate('community.myBooks')}</SectionLabel>
            <Box sx={{ px: 2 }}>
                {myBooks.length === 0 ? (
                    <EmptyState label={translate('community.noBooks')} />
                ) : (
                    myBooks.map((item: ClientBooks, idx) => (
                        <ListRaad
                            key={idx}
                            courtType={item.type}
                            courtName={item.courtName}
                            toDelete
                            mainText={item.weekday + ' ' + item.hour}
                            id={item.id}
                            secondText={item.duration + 'h — ' + item.clientName}
                        />
                    ))
                )}
            </Box>

            <Divider sx={{ mx: 2, borderColor: 'divider' }} />

            {/* Other bookings */}
            <SectionLabel>{translate('community.otherUserBooks')}</SectionLabel>
            <Box sx={{ px: 2 }}>
                {otherBooks.length === 0 ? (
                    <EmptyState label={translate('community.noBooks')} />
                ) : (
                    otherBooks.map((item: ClientBooks, idx) => (
                        <ListRaad
                            key={idx}
                            courtType={item.type}
                            courtName={item.courtName}
                            toDelete={false}
                            mainText={item.weekday + ' ' + item.hour}
                            id={item.id}
                            secondText={item.duration + 'h — ' + item.clientName}
                        />
                    ))
                )}
            </Box>
        </Box>
    );
};

export default Comunity;
