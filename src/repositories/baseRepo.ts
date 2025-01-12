import { Document, Model, FilterQuery, PipelineStage } from 'mongoose'

export class BaseRepository<T extends Document> {

    private _model: Model<T>

    constructor(model: Model<T>) {

        this._model = model
    }


    async findAll(filter?: FilterQuery<T>): Promise<T[]> {
        return await this._model.find(filter || {}).exec();
    }

    async save(item: Partial<T>): Promise<T | null> {
        const newItem = new this._model(item)
        return await newItem.save()
    }

    async findOne(filter: FilterQuery<T>): Promise<T | null> {
        return this._model.findOne(filter)
    }

    // Find a document by ID
    async findById(id: string): Promise<T | null> {
        return this._model.findById(id).exec();
    }
    async findByIdd(id: string): Promise<T | null> {
        return this._model.findById(id).populate('userId', 'name profileImage').exec();
    }

    // Find documents with custom filters
    async findByFilter(filter: FilterQuery<T>): Promise<T[]> {
        return this._model.find(filter).exec();
    }

    async aggregate(pipeline: PipelineStage[]): Promise<any[]> {
        return await this._model.aggregate(pipeline).exec();
    }


    async findWithPagination(filter: FilterQuery<T>, limit: number, offset: number): Promise<T[]> {
        return await this._model
            .find(filter)
            .populate('userId', 'name email profileImage') 
            .skip(offset)
            .limit(limit)
            .exec();
    }

    async countDocuments(filter: FilterQuery<T>): Promise<number> {
        return await this._model.countDocuments(filter).exec();
    }


    async updateById(id: string, updateData: Partial<T>): Promise<T | null> {
        return await this._model.findByIdAndUpdate(id, updateData, { new: true });
    }


     async deleteById(id: string):  Promise<T | null> {
        return await this._model.findByIdAndDelete(id);
    }
}