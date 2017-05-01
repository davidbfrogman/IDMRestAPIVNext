export const allconfigs = {
    dev: {
        //mongoConnectionString: "mongodb://localhost:27017/idmdocumentdb",
        mongoConnectionString: process.env.MONGO_CONNECTION_STRING || "mongodb://dbrown:password1@ds157320.mlab.com:57320/idmdocumentdb",
        AMPQConnectionString: process.env.AMPQ_CONNECTION_STRING || "amqp://wkaxkarj:NAsD1ISNCESHMmVlK9Mch6IcBjapIBYn@puma.rmq.cloudamqp.com/wkaxkarj",
        jwtSecretToken: 'a0sd7f70as8vhasd7f79as8d^&&^87qwefhs0v8adgasdh',
        production: false,
        port: process.env.PORT || 8080,
        isConsoleLoggingActive:true,
    },
    unitTesting: {
        mongoConnectionString: process.env.MONGO_CONNECTION_STRING || "mongodb://dbrown:password1@ds157320.mlab.com:57320/idmdocumentdbtesting",
        AMPQConnectionString: process.env.AMPQ_CONNECTION_STRING || "amqp://wkaxkarj:NAsD1ISNCESHMmVlK9Mch6IcBjapIBYn@puma.rmq.cloudamqp.com/wkaxkarj",
        jwtSecretToken: 'a0sd7f70as8vhasd7f79as8d^&&^87qwefhs0v8adgasdh',
        production: false,
        port: process.env.PORT || 8080,
        isConsoleLoggingActive:true,
    },
    prod: {
        mongoConnectionString: process.env.MONGO_CONNECTION_STRING ||  "mongodb://dbrown:password1@ds157320.mlab.com:57320/idmdocumentdb",
        AMPQConnectionString: process.env.AMPQ_CONNECTION_STRING || "amqp://wkaxkarj:NAsD1ISNCESHMmVlK9Mch6IcBjapIBYn@puma.rmq.cloudamqp.com/wkaxkarj",
        jwtSecretToken: 'ry8e0yw7eu653h560tg9970g8ahd*^%$*Ssasdgad8(^&*Fasdf',
        production: true,   
        port: process.env.PORT || 8080,
        isConsoleLoggingActive:true
    },
}

export class Config {
    public static currentConfig(): IConfigType{
        if(process.env.NODE_ENV === 'production'){
            return allconfigs.prod;
        }
        if(process.env.NODE_ENV === 'unitTest')
        {
            return allconfigs.unitTesting;
        }
        else{
            return allconfigs.dev;
        }
    }
}

export interface IConfigType{
    mongoConnectionString: string;
    AMPQConnectionString: string;
    jwtSecretToken: string;
    production: boolean;
    port: number;
    isConsoleLoggingActive: boolean;
}