package com.example.spm.service;


import com.example.spm.exception.*;
import com.example.spm.model.dto.*;
import com.example.spm.model.entity.AppUser;
import com.example.spm.model.entity.Project;
import com.example.spm.model.entity.Task;
import com.example.spm.model.entity.Todo;
import com.example.spm.model.enums.*;
import com.example.spm.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
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

    @Transactional
    @Modifying
    public void deleteTask(Integer taskId, MyAppUserDetails loggedInUser) {
        Task task = checkIfTaskExists(taskId);
        checkIfTaskBelongsToManager(task, loggedInUser);
        taskRepository.delete(task);
    }

    public List<Task> getAllTasksWithSearchKeyAndManagerId(String searchKey, Integer managerId) {
        return taskRepository.getAllTasksWithSearchKeyAndManagerId(managerId, searchKey);
    }

    public Task completeTask(Integer taskId) {
        Task task = checkIfTaskExists(taskId);
        task.setStatus(TaskStatus.COMPLETED);
        return taskRepository.save(task);
    }

    public void checkIfTaskBelongsToManager(Task task, MyAppUserDetails loggedInUser) {
        if (!task.getProject().getManager().getId().equals(loggedInUser.getUser().getId()))
            throw new ActionNotAllowedException("Cannot create todo for this task as this project does not belong to you");
    }

    public List<Task> getAllTasksWithSearchKeyAndEmployeeId(String searchKey, Integer employeeId) {
        return taskRepository.getAllTasksWithSearchKeyAndEmployeeId(employeeId, searchKey);
    }
}
