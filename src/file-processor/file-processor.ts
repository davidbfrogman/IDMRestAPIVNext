import { rabbit, exchange, queue } from '../config/queue';
import { Constants } from "../constants";
import log = require('winston');
import { IFile } from "../models/file";

queue.consume((file: IFile, ack) => {
    try {
        log.info('consumed message from queue:', JSON.stringify(file));
        if (file.resources) {
            log.info(`File Properties name: ${file.name}, size: ${file.resources[0].size}, location: ${file.resources[0].location}`);
        }
        ack();
    }
    catch (error) {
        queue.nack();
        log.error(`There was an error processing queue data:${error}`);
    }
});
