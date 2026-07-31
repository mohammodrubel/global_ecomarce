import { Color } from "@prisma/client"
import prisma from "../../utils/prisma"

const createProductColor = async (payload: Color) => {
    const result = await prisma.color.create(
        {
            data: payload
        }
    )
    return result
}
const getAllProductColors = async () => {
    const reuslt = await prisma.color.findMany({})
    return reuslt
}
const getSingleProductColor = async (id: string) => {
    const reuslt = await prisma.color.findUnique(
        {
            where: {
                id: id
            }
        }
    )
    return reuslt
}
const updateProductColor = async (id: string, payload: Partial<Color>) => {
    const reuslt = await prisma.color.update(
        {
            where: {
                name: payload.name
            },
            data: {
                id: id
            }
        }
    )
    return reuslt
}
const deleteProductColor = async (id: string) => {
    const reuslt = await prisma.color.delete(
        {
            where: {
                id: id
            }
        }
    )
    return reuslt
}


export const ProductColorService = {
    createProductColor,
    getAllProductColors,
    getSingleProductColor,
    updateProductColor,
    deleteProductColor,
};
