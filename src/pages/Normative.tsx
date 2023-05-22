
import { useEffect, useState } from 'react';
import { GetNormative } from '../api/request';
import NormativeAccordion from '../components/normative/NormativeAccordion';
import { NormativeList } from '../interfaces/NormativeList';

const Normative = () => {
    const [normative, setNormative] = useState<NormativeList[]>([]);
    useEffect(() => {
        GetNormative((n: NormativeList[]) => setNormative(n));
    }, [])

    return (
        <div style={{ marginTop: 80 , marginBottom: 100}}>
            {normative.map((item, idx) =>
                <NormativeAccordion
                    key={idx}
                    main={item.title}
                    second={item.text} />
            )}
        </div>
    )
}

export default Normative;
