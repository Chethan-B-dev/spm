package com.example.spm.service;


import com.example.spm.exception.TodoNotFoundException;
import com.example.spm.model.dto.CreateTodoDTO;
import com.example.spm.model.dto.UpdateTodoDTO;
import com.example.spm.model.entity.Task;
import com.example.spm.model.entity.Todo;
import com.example.spm.model.enums.TodoStatus;
import com.example.spm.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.jni.Local;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class TodoService {
    private final TodoRepository todoRepository;
    private final TaskService taskService;

    public Todo createTodo(CreateTodoDTO createTodoDTO, MyAppUserDetails loggedInUser, Integer taskId) {
        Task task = taskService.checkIfTaskExists(taskId);
        taskService.checkIfTaskBelongsToManager(task, loggedInUser);

        Todo todo = Todo.builder()
                .name(createTodoDTO.getTodoName())
                .status(TodoStatus.TO_DO)
                .task(task)
                .createdOn(LocalDate.now())
                .build();

        return todoRepository.save(todo);
    }

    public Todo getTodoById(Integer todoId) {
        return checkIfTodoExists(todoId);
    }

    public Todo checkIfTodoExists(Integer todoId) {
        return todoRepository
                .findById(todoId)
                .orElseThrow(() -> new TodoNotFoundException("Todo with id '" + todoId + "' does not exists"));
    }

    public List<Todo> getAllTaskTodos(Integer taskId) {
        return todoRepository.findAllByTaskId(taskId);
    }


    public Todo updateTodo(Integer todoId, UpdateTodoDTO updateTodoDTO) {
        Todo todo = checkIfTodoExists(todoId);
        todo.setName(updateTodoDTO.getTodoName());
        todo.setStatus(updateTodoDTO.getStatus());
        todo.setCompletedOn(todo.getStatus().equals(TodoStatus.DONE) ? LocalDate.now() : null);
        todo.setTask(taskService.checkIfTaskExists(updateTodoDTO.getTaskId()));
        return todo;
    }

    @Transactional
    @Modifying
    public void deleteTodo(Integer todoId) {
        Todo todo = checkIfTodoExists(todoId);
        todoRepository.delete(todo);
    }

    public List<Todo> getAllTodosWithSearchKeyAndManagerId(String searchKey, Integer managerId) {
        return todoRepository.getAllTodosWithSearchKeyAndManagerId(managerId, searchKey);
    }

    public List<Todo> getAllTodosWithSearchKeyAndEmployeeId(String searchKey, Integer employeeId) {
        return todoRepository.getAllTodosWithSearchKeyAndEmployeeId(employeeId, searchKey);
    }
}
