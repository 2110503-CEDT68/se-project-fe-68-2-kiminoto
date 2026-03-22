"use client";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

type DateReserveProps = {
    value: Dayjs | null;
    onChange: (value: Dayjs | null) => void;
};

export default function DateReserve({ value, onChange }: DateReserveProps) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                value={value}
                onChange={onChange}
                slotProps={{
                    textField: {
                        variant: "standard",
                        fullWidth: true,
                        sx: {
                            '*' : { fontFamily: 'Noto Serif JP, serif'},
                            '*:after': { borderBottomColor: '#b42828' },  
                        },
                    },
                    desktopPaper: {
                        sx: {
                            '*' : { fontFamily: 'Noto Serif JP, serif' },
                        },
                    },
                }}
            />
        </LocalizationProvider>
    );
}