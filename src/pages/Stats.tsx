import { useEffect, useState } from "react";
import { GetStats } from "../api/request";
import { StatsInfo } from "../interfaces/StatsDto";
import LineChartAdmin from "../components/admin/LineChartAdmin";
import LineChartHours from "../components/admin/LineChartHours";
import { useNavigate } from "react-router-dom";

const Stats = () => {
    const [statsData, setStatsData] = useState<StatsInfo[]>([]);
    const [statsHours, setStatsHours] = useState<StatsInfo[]>([]);
    const navigator = useNavigate();

    const getStatsHours = (stats: StatsInfo[]): StatsInfo[] => {
        const distinctHours = [...new Set(stats.map(stat => stat.date.split(' ')[1].split(":")[0]))];
        return distinctHours
            .map(hour => ({
                date: hour,
                success: true,
                count: stats.filter(stat => stat.date.split(' ')[1].split(":")[0] === hour).length,
            }))
            .sort((itemA, itemB) => itemA.date.localeCompare(itemB.date));
    }

    const getStatsLogins = (stats: StatsInfo[]) => {
        const distictDates = new Set(stats.map(stat => stat.date.split(' ')[0]));
        const newStats: StatsInfo[] = [];
        distictDates.forEach((date) => {
            newStats.push({
                date: date.split('/')[1],
                success: true,
                count: stats.filter(stat => stat.date.split(' ')[0] == date && stat.success).length,
                countNOK: stats.filter(stat => stat.date.split(' ')[0] == date && !stat.success).length
            });
        });
        return newStats;
    };


    useEffect(() => {
        const callback = (stats: StatsInfo[]) => {
            setStatsHours(getStatsHours(stats));
            setStatsData(getStatsLogins(stats));
        }
        const onError = () => navigator('/login');
        GetStats(callback, onError);
    }, []);

    return (
        <>
            <h2>Logins sort by day:</h2>
            <LineChartAdmin data={statsData} />
            <h2>Logins sort by hour:</h2>
            <LineChartHours data={statsHours} />
        </>
    )
}

export default Stats;
function callback(output: StatsInfo[]): void {
    throw new Error("Function not implemented.");
}

