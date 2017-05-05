import { IFile, FileComposite } from "../models/file";
import { IResource, ResourceComposite } from "../models/resource";

import { rabbit, exchange, queue } from '../config/queue';
import { Constants } from "../constants";
import log = require('winston');


queue.consume((file: IFile, ack) => {
    try {
        var resource = ResourceComposite.modelName; //This ensures that the resource model is actually registered.
        log.info('consumed message from queue:', JSON.stringify(file));
        FileComposite.findById(file._id).populate('resources').then((file) => {
            if (!file) {
                throw new Error('Couldnt find the file')
            }
            if (file.resources) {
                log.info(`File Properties name: ${file.name}, size: ${file.resources[0].size}, location: ${file.resources[0].location}`);
            }
        }).catch((error: Error) => {
            log.error(`There was an error finding the file. message:${error.message}`, error);
            queue.nack()
        });

        ack();
    }
    catch (error) {
        queue.nack();
        log.error(`There was an error processing queue data:${error}`);
    }
});
