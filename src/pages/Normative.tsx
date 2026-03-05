import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { GetNormative } from '../api/request';
import NormativeAccordion from '../components/normative/NormativeAccordion';
import { NormativeList } from '../interfaces/NormativeList';

const Normative = () => {
    const [normative, setNormative] = useState<NormativeList[]>([]);

    useEffect(() => {
        GetNormative((n: NormativeList[]) => setNormative(n));
    }, []);

    return (
        <Box sx={{ pt: '80px', pb: '80px', px: 2 }}>
            {normative.map((item, idx) => (
                <NormativeAccordion
                    key={idx}
                    main={item.title}
                    second={item.text}
                />
            ))}
        </Box>
    );
};

export default Normative;
