export interface TimerDurations {
    pomodoro: number; // in minutes
    shortBreak: number; // in minutes
    longBreak: number; // in minutes
}

export type PomodoroSetting = {
    id: string;
    focusDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    sessionsBeforeLongBreak: number;
    autoStartBreak: boolean;
    autoStartFocus: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type GetSettingResponse = {
    success: boolean;
    data: PomodoroSetting;
};

export type UpdateSettingPayload = {
    focusDuration?: number;
    shortBreakDuration?: number;
    longBreakDuration?: number;
    sessionsBeforeLongBreak?: number;
    autoStartBreak?: boolean;
    autoStartFocus?: boolean;
};

export type UpdateSettingResponse = {
    success: boolean;
    message: string;
    data: PomodoroSetting;
};
