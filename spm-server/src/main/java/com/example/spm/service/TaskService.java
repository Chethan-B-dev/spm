package com.example.spm.service;


import com.example.spm.exception.*;
import com.example.spm.model.dto.*;
import com.example.spm.model.entity.AppUser;
import com.example.spm.model.entity.Project;
import com.example.spm.model.entity.Task;
import com.example.spm.model.enums.*;
import com.example.spm.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;

    public Task createTask(CreateTaskDTO createTaskDTO, Project project, AppUser employee) {
        Task task = Task.builder()
                .name(createTaskDTO.getName())
                .createdDate(LocalDate.now())
                .description(createTaskDTO.getDescription())
                .project(project)
                .priority(createTaskDTO.getPriority() != null ? createTaskDTO.getPriority() : TaskPriority.LOW)
                .status(TaskStatus.IN_PROGRESS)
                .user(employee)
                .deadLine(createTaskDTO.getDeadLine())
                .build();
        return taskRepository.save(task);
    }

    public Task getTaskById(Integer taskId) {
        return checkIfTaskExists(taskId);
    }   


    public Task checkIfTaskExists(Integer taskId) {
        return taskRepository
                .findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task with id '" + taskId + "' does not exists"));
    }

    public void checkIfTaskBelongsToEmployee(Task task, Integer employeeId) {
        if (!task.getUser().getId().equals(employeeId))
            throw new ActionNotAllowedException("Cannot access this task resource");
    }

    public List<Task> getAllProjectTasks(Integer projectId) {
        return taskRepository.findAllByProjectId(projectId);
    }

    public Task updateTask(Integer taskId, UpdateTaskDTO updateTaskDTO) {
        Task task = checkIfTaskExists(taskId);
        task.setName(updateTaskDTO.getTaskName());
        task.setDeadLine(updateTaskDTO.getDeadline());
        task.setPriority(updateTaskDTO.getPriority());
        task.setDescription(updateTaskDTO.getDescription());
        return taskRepository.save(task);
    }

    public List<Task> getUserTasks(Integer projectId, Integer userId) {
        return taskRepository.findAllByProjectIdAndUserId(projectId, userId);
    }

    public List<Task> getAllTasksWithSearchKey(String searchKey, Integer managerId) {
        return taskRepository.getAllTasksWithSearchKey(managerId, searchKey);
    }
}
