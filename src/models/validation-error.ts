export interface ValidationError{
    message: string;
    field: string;
    path: string;
    value: string;
}