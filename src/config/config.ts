export const config = {
    devConfig: {
        mongoConnectionString: "mongodb://dbrown:password1@ds157320.mlab.com:57320/idmdocumentdb",
        AMPQConnectionString: "amqp://wkaxkarj:NAsD1ISNCESHMmVlK9Mch6IcBjapIBYn@puma.rmq.cloudamqp.com/wkaxkarj",
        jwtSecretToken: 'a0sd7f70as8vhasd7f79as8d^&&^87qwefhs0v8adgasdh',
        production: false,
        port: process.env.PORT || 8080
    },
    prodConfig: {
        mongoConnectionString: "mongodb://dbrown:password1@ds157320.mlab.com:57320/idmdocumentdb",
        AMPQConnectionString: "amqp://wkaxkarj:NAsD1ISNCESHMmVlK9Mch6IcBjapIBYn@puma.rmq.cloudamqp.com/wkaxkarj",
        jwtSecretToken: 'ry8e0yw7eu653h560tg9970g8ahd*^%$*Ssasdgad8(^&*Fasdf',
        production: true,   
        port: process.env.PORT || 8080
    },
}