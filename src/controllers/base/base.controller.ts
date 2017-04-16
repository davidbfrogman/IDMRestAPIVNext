import { Router, Request, Response, RequestParamHandler, NextFunction, RequestHandler } from 'express';
import mongoose = require('mongoose');
import { Schema, Model, Document } from 'mongoose';
import { ListOptions } from '../../models/list-options';

export class BaseController{

    public getId(request: Request) : string{
        return request && request.params ? request.params['id']: null;
    }
}