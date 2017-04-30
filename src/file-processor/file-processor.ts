import { rabbit, exchange, queue } from '../config/queue';
import { Constants } from "../constants";
import log = require('winston');
import { IFile } from "../models/file";

queue.consume((file: IFile, ack) => {
    try {
        log.info('consumed message from queue:', JSON.stringify(file));
        log.info(`File Properties name: ${file.name}, size: ${file.size}, location: ${file.location}`)
        ack();
    }
    catch (error) {
        queue.nack();
        log.error(`There was an error processing queue data:${error}`);
    }
});
