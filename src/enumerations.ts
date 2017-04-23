export enum ValidationType {
    Length = 1,
    Required = 2,
    Regex = 3
}

export enum FieldStyle {
    String = 1,
    Number = 2,
    Time = 3,
    Date = 4,
    Timestamp = 5,
    Boolean = 6,
}


export class EnumHelper {
    public static GetValuesFromEnum<E>(e: E): Array<Number> {
        let keys = Object.keys(e);
        let enumValues = new Array<Number>();
        keys.forEach(key => {
            enumValues.push(e[key]);
        });
        return enumValues;
    }
}

//Enum Parsing - Remember basically you really need to cast it as string for it to work. 
//var colorId = <string>myOtherObject.colorId; // Force string value here
//var color: Color = Color[colorId]; // Fixes lookup here.