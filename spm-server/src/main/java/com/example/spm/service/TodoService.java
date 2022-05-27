package com.example.spm.service;


import com.example.spm.exception.*;
import com.example.spm.model.dto.*;
import com.example.spm.model.entity.AppUser;
import com.example.spm.model.entity.Project;
import com.example.spm.model.entity.Task;
import com.example.spm.model.entity.Todo;
import com.example.spm.model.enums.TodoStatus;
import com.example.spm.model.enums.UserRole;
import com.example.spm.model.enums.UserStatus;
import com.example.spm.repository.AppUserRepository;
import com.example.spm.repository.ProjectRepository;
import com.example.spm.repository.TaskRepository;
import com.example.spm.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import java.time.LocalDate;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class TodoService {
    private final TodoRepository todoRepository;
    private final TaskRepository taskRepository;

    private Task checkIfTaskExists(Integer taskId) {
        return taskRepository
                .findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task with id '" + taskId + "' does not exists"));
    }

    public Todo createTodo(CreateTodoDTO createTodoDTO, MyAppUserDetails loggedInUser, Integer taskId) {
        Task task = checkIfTaskExists(taskId);
        Todo todo = Todo.builder()
                .name(createTodoDTO.getTodoName())
                .status(TodoStatus.ASSIGNED)
                .task(task)
                .createdOn(LocalDate.now())
                .build();

        return todoRepository.save(todo);
    }

    public Todo getTodoById(Integer todoId) {
        return checkIfTodoExists(todoId);
    }

    private Todo checkIfTodoExists(Integer todoId) {
        return todoRepository
                .findById(todoId)
                .orElseThrow(() -> new TodoNotFoundException("Todo with id '" + todoId + "' does not exists"));
    }

    public List<Todo> getAllTaskTodos(Integer taskId) {
        Task task = checkIfTaskExists(taskId);
        return todoRepository.findAllByTaskId(taskId);
    }


    public Todo updateTodo(Integer todoId, UpdateTodoDTO updateTodoDTO) {
        Todo todo = checkIfTodoExists(todoId);
        todo.setName(updateTodoDTO.getTodoName());
        todo.setStatus(updateTodoDTO.getStatus());
        todo.setTask(checkIfTaskExists(updateTodoDTO.getTaskId()));
        return todo;
    }
}
