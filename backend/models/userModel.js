import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({
    userName: {type:String , required:true},
    userEmail: {type:String ,unique:true, required:true},
    userPassword: {type:String, required:true},
    userPhone: {type:String, required:true},
    userImage: {type:String, default:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4QBWRXhpZgAASUkqAAgAAAADAA4BAgAMAAAAMgAAABoBBQABAAAAPgAAABsBBQABAAAARgAAAAAAAABwaWN0dXJlIGljb24sAQAAAQAAACwBAAABAAAA/+EFh2h0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyI+Cgk8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgoJCTxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6SXB0YzR4bXBDb3JlPSJodHRwOi8vaXB0Yy5vcmcvc3RkL0lwdGM0eG1wQ29yZS8xLjAveG1sbnMvIiAgIHhtbG5zOkdldHR5SW1hZ2VzR0lGVD0iaHR0cDovL3htcC5nZXR0eWltYWdlcy5jb20vZ2lmdC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBsdXM9Imh0dHA6Ly9ucy51c2VwbHVzLm9yZy9sZGYveG1wLzEuMC8iICB4bWxuczppcHRjRXh0PSJodHRwOi8vaXB0Yy5vcmcvc3RkL0lwdGM0eG1wRXh0LzIwMDgtMDItMjkvIiB4bWxuczp4bXBSaWdodHM9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9yaWdodHMvIiBwaG90b3Nob3A6Q3JlZGl0PSJHZXR0eSBJbWFnZXMvaVN0b2NrcGhvdG8iIEdldHR5SW1hZ2VzR0lGVDpBc3NldElEPSI5MzE2NDMxNTAiIHhtcFJpZ2h0czpXZWJTdGF0ZW1lbnQ9Imh0dHBzOi8vd3d3LmlzdG9ja3Bob3RvLmNvbS9sZWdhbC9saWNlbnNlLWFncmVlbWVudD91dG1fbWVkaXVtPW9yZ2FuaWMmYW1wO3V0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'},
    userAddress: {type:Object,  required:true},
    userProvider: {type:Object, default:{}}
    
},{minimize:false})

const userModel = mongoose.models.user || mongoose.model('user',userSchema)

export default userModel